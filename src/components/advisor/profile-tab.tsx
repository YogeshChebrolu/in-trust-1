"use client";

// The profile ("persona") content — the pinned first tab of the artifact
// panel. Landing-page variant of the product's ProfileTabContent: the live app
// reads this from Convex; here it takes a static profile prop.

import { HeartPulse, MapPin, Shield, Target, Users, Wallet } from "lucide-react";

export interface ProfileMember {
  relation?: string;
  age?: number;
  gender?: string;
  preExistingConditions?: string[];
  smokerOrTobacco?: boolean;
}

export interface Profile {
  insuranceType?: "health" | "life" | "unsure";
  forWhom?: string;
  members?: ProfileMember[];
  city?: string;
  annualBudgetInr?: number;
  desiredCoverInr?: number;
  priorities?: string[];
  notes?: string[];
}

const inr = (n?: number) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(n)
    : undefined;

const TYPE_LABEL: Record<NonNullable<Profile["insuranceType"]>, string> = {
  health: "Health cover",
  life: "Life cover",
  unsure: "Still deciding",
};

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function memberName(relation?: string) {
  if (!relation) return "Person";
  const r = relation.toLowerCase();
  if (["self", "me", "myself", "i"].includes(r)) return "You";
  return titleCase(relation);
}

export function ProfileTab({
  profile,
  progress = 1,
}: {
  profile: Profile;
  /** 0..1 — how far the chat has played; sections reveal in step with it. */
  progress?: number;
}) {
  // Each section appears once the conversation has surfaced it.
  const show = {
    lookingFor: progress >= 0.06,
    whoCovered: progress >= 0.24,
    cityBudget: progress >= 0.56,
    priorities: progress >= 0.66,
    notes: progress >= 0.82,
  };
  const anything = show.lookingFor;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-text-dark text-sm font-semibold">Your profile</h2>
        <p className="text-text-muted text-xs">What I&apos;ve understood so far</p>
      </div>

      {!anything ? (
        <p className="text-text-muted text-xs leading-relaxed">
          Nothing noted yet. As we talk, I&apos;ll quietly keep track of who
          you&apos;re insuring, ages, any health conditions, your budget and what
          matters to you — and it&apos;ll show up here.
        </p>
      ) : (
      <div className="flex flex-col gap-5">
        {show.lookingFor && profile.insuranceType && (
          <Section icon={HeartPulse} label="Looking for">
            <span className="bg-secondary text-primary-dark inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium">
              {TYPE_LABEL[profile.insuranceType]}
            </span>
          </Section>
        )}

        {show.whoCovered && (profile.forWhom || profile.members?.length) && (
          <Section icon={Users} label="Who's covered">
            {profile.forWhom && (
              <p className="text-text-dark text-sm">{profile.forWhom}</p>
            )}
            {profile.members?.map((m, i) => (
              <div key={i} className="text-sm">
                <p className="text-text-dark">
                  {memberName(m.relation)}
                  {typeof m.age === "number" && (
                    <span className="text-text-muted">
                      {" "}
                      · {m.age}
                      {m.gender ? `, ${m.gender}` : ""}
                    </span>
                  )}
                  {m.smokerOrTobacco && (
                    <span className="text-text-muted"> · tobacco</span>
                  )}
                </p>
                {m.preExistingConditions &&
                  (m.preExistingConditions.length > 0 ? (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {m.preExistingConditions.map((c) => (
                        <Chip key={c}>{c}</Chip>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-muted text-xs">
                      No pre-existing conditions
                    </p>
                  ))}
              </div>
            ))}
          </Section>
        )}

        {show.cityBudget && profile.city && (
          <Section icon={MapPin} label="City">
            <p className="text-text-dark text-sm">{profile.city}</p>
          </Section>
        )}

        {show.cityBudget && (profile.annualBudgetInr || profile.desiredCoverInr) && (
          <Section icon={Wallet} label="Budget & cover">
            {profile.annualBudgetInr && (
              <p className="text-text-dark text-sm">
                {inr(profile.annualBudgetInr)}
                <span className="text-text-muted"> / year</span>
              </p>
            )}
            {profile.desiredCoverInr && (
              <p className="text-text-dark text-sm">
                <span className="text-text-muted">Cover: </span>
                {inr(profile.desiredCoverInr)}
              </p>
            )}
          </Section>
        )}

        {show.priorities && profile.priorities && profile.priorities.length > 0 && (
          <Section icon={Target} label="Priorities">
            <div className="flex flex-wrap gap-1">
              {profile.priorities.map((p) => (
                <Chip key={p}>{p}</Chip>
              ))}
            </div>
          </Section>
        )}

        {show.notes && profile.notes && profile.notes.length > 0 && (
          <Section icon={Shield} label="Notes">
            <ul className="flex flex-col gap-1">
              {profile.notes.map((n, i) => (
                <li key={i} className="text-text-muted text-xs leading-relaxed">
                  {n}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
      )}
    </div>
  );
}

function Section({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5">
        <Icon className="text-primary-light size-3.5" />
        <span className="text-text-muted text-xs font-medium tracking-wide uppercase">
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 pl-5">{children}</div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-secondary text-primary-dark inline-flex rounded px-2 py-0.5 text-xs">
      {children}
    </span>
  );
}
