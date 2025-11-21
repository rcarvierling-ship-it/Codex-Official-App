'use client';

import { useMemo } from "react";

import { useDemoStore, personaOptions } from "./demoStore";

export function usePersonaMeta() {
  const currentPersona = useDemoStore((state) => state.currentPersona);

  return useMemo(
    () =>
      personaOptions.find((persona) => persona.label === currentPersona) ??
      personaOptions[0],
    [currentPersona],
  );
}

export function useEventDetails(eventId: string) {
  const event = useDemoStore((state) =>
    state.events.find((item) => item.id === eventId),
  );
  const teams = useDemoStore((state) => state.teams);
  const venues = useDemoStore((state) => state.venues);
  const schools = useDemoStore((state) => state.schools);
  const leagues = useDemoStore((state) => state.leagues);
  const users = useDemoStore((state) => state.users);
  const requests = useDemoStore((state) =>
    state.requests.filter((request) => request.eventId === eventId),
  );
  const assignments = useDemoStore((state) =>
    state.assignments.filter((assignment) => assignment.eventId === eventId),
  );
  const notes = useDemoStore((state) => state.notesByEvent[eventId] ?? "");

  return useMemo(() => {
    if (!event) {
      return null;
    }

    const homeTeam = teams.find((team) => team.id === event.homeTeamId);
    const awayTeam = teams.find((team) => team.id === event.awayTeamId);
    const venue = venues.find((item) => item.id === event.venueId);
    const school = schools.find((item) => item.id === event.schoolId);
    const league = leagues.find((item) => item.id === event.leagueId);

    const audience = requests.map((request) => ({
      ...request,
      user: users.find((user) => user.id === request.userId),
    }));

    const roster = assignments.map((assignment) => ({
      ...assignment,
      user: users.find((user) => user.id === assignment.userId),
    }));

    return {
      event,
      homeTeam,
      awayTeam,
      venue,
      school,
      league,
      requests: audience,
      assignments: roster,
      notes,
    };
  }, [
    event,
    teams,
    venues,
    schools,
    leagues,
    requests,
    assignments,
    users,
    notes,
  ]);
}
