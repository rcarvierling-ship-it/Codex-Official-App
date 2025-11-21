import { AccessDeniedError } from "./scopeErrors";

export type AccessScope = {
  id?: string | null;
  role?: string | null;
  userLeagueIds: string[];
  userSchoolIds: string[];
  userTeamIds?: string[];
};

type MembershipContext = {
  schoolId?: string | null;
  school?: { leagueId?: string | null } | null;
  leagueId?: string | null;
};

function uniq(values: (string | null | undefined)[]) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

export function buildAccessScope(
  user: any,
  membership?: MembershipContext,
  { allowEmpty }: { allowEmpty?: boolean } = {}
): AccessScope {
  const userLeagueIds = Array.isArray(user?.userLeagueIds)
    ? uniq(user.userLeagueIds)
    : uniq([membership?.school?.leagueId, membership?.leagueId]);
  const userSchoolIds = Array.isArray(user?.userSchoolIds)
    ? uniq(user.userSchoolIds)
    : uniq([membership?.schoolId]);
  const userTeamIds = Array.isArray(user?.userTeamIds)
    ? uniq(user.userTeamIds)
    : [];

  const scope: AccessScope = {
    id: user?.id ?? user?.email ?? null,
    role: user?.role ?? null,
    userLeagueIds,
    userSchoolIds,
    userTeamIds,
  };

  if (!allowEmpty) {
    assertScope(scope);
  }

  return applyRoleOverrides(scope);
}

export function applyRoleOverrides(scope: AccessScope): AccessScope {
  const role = String(scope.role ?? "").toLowerCase();

  if (role === "league_admin") {
    // league admin already scoped by league ids
    return scope;
  }

  if (role === "school_admin" || role === "athletic_director") {
    return { ...scope, userLeagueIds: scope.userLeagueIds, userSchoolIds: scope.userSchoolIds };
  }

  if (role === "coach") {
    // Coaches can only see their team and school
    return {
      ...scope,
      userLeagueIds: [],
      userSchoolIds: scope.userSchoolIds,
      userTeamIds: scope.userTeamIds,
    };
  }

  if (role === "official") {
    // Officials only see the schools/leagues they belong to; actual assignments enforced per-query
    return { ...scope, userLeagueIds: scope.userLeagueIds, userSchoolIds: scope.userSchoolIds };
  }

  if (role === "parent" || role === "fan" || role === "guest") {
    throw new AccessDeniedError("Access denied: Out of scope");
  }

  return scope;
}

export function assertScope(scope: AccessScope) {
  if (
    !scope.userLeagueIds?.length &&
    !scope.userSchoolIds?.length &&
    !(scope.userTeamIds && scope.userTeamIds.length)
  ) {
    throw new AccessDeniedError("Access denied: Out of scope");
  }
}

export function entityInScope(
  scope: AccessScope,
  entity: { leagueId?: string | null; schoolId?: string | null; teamId?: string | null }
) {
  if (entity.teamId && scope.userTeamIds?.includes(entity.teamId)) return true;
  if (entity.schoolId && scope.userSchoolIds.includes(entity.schoolId)) return true;
  if (entity.leagueId && scope.userLeagueIds.includes(entity.leagueId)) return true;
  return false;
}

export function filterEntitiesByScope<T extends { leagueId?: string | null; schoolId?: string | null; teamId?: string | null }>(
  rows: T[],
  scope?: AccessScope
): T[] {
  if (!scope) return rows;
  assertScope(scope);
  return rows.filter((row) => entityInScope(scope, row));
}
