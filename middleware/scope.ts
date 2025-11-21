import { and, inArray } from "drizzle-orm";

import { AccessDeniedError } from "@/lib/scopeErrors";
import { AccessScope, assertScope, buildAccessScope } from "@/lib/scope";

type TableWithScope = {
  leagueId?: any;
  schoolId?: any;
  teamId?: any;
  officialId?: any;
};

type ScopeOptions = {
  officialColumn?: any;
  teamColumn?: any;
};

export function withScope<TQuery>(
  user: any,
  query: TQuery,
  table: TableWithScope,
  options: ScopeOptions = {}
): TQuery {
  const scope: AccessScope = buildAccessScope(user);
  assertScope(scope);

  const clauses = [] as any[];
  if (table.leagueId && scope.userLeagueIds.length) {
    clauses.push(inArray(table.leagueId, scope.userLeagueIds));
  }
  if (table.schoolId && scope.userSchoolIds.length) {
    clauses.push(inArray(table.schoolId, scope.userSchoolIds));
  }
  if (options.teamColumn && scope.userTeamIds?.length) {
    clauses.push(inArray(options.teamColumn, scope.userTeamIds));
  }
  if (options.officialColumn && scope.id) {
    clauses.push(inArray(options.officialColumn, [scope.id]));
  }

  if (clauses.length === 0) {
    throw new AccessDeniedError();
  }

  // @ts-ignore drizzle query builders expose where()
  const scopedQuery = (query as any).where(clauses.length === 1 ? clauses[0] : and(...clauses));
  return scopedQuery as TQuery;
}
