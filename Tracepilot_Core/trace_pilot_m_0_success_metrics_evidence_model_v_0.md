# TracePilot — M0 Success Metrics & Evidence Model v0.1

## Document Control

- **Document ID**: TP-M0-SMEM-v0.1
- **Status**: Draft Validation Evidence Baseline
- **Authority**: TracePilot M0 Success and Evidence Baseline
- **Scope**: Defines the success metrics, evidence classes, scoring logic, and decision thresholds for TracePilot M0 validation
- **Depends On**:
  - MPLP Protocol v1.0.0
  - Coregentis Cognitive OS — Master Architecture Baseline v0.1
  - Coregentis Cognitive OS — Runtime Constitution Spec v0.1
  - TracePilot — Product Projection Baseline v0.1
  - TracePilot — M0 First Wow Moment & Validation Spec v0.1
  - TracePilot — M0 Death Paths & Failure Matrix v0.1
  - TracePilot — M0 Validation Interview Framework v0.1
  - TracePilot — M0 Scenario Pack v0.1
- **Trace Tags**:
  - `tracepilot/m0`
  - `success-metrics`
  - `evidence-model`
  - `validation-decision`
  - `go-no-go`

---

# 1. Purpose

This document defines the **Success Metrics & Evidence Model** for TracePilot M0.

Its purpose is to make M0 validation measurable, comparable, and decision-usable.

This document defines:

- what counts as evidence in M0 validation
- what success dimensions M0 must be judged on
- how success and failure signals should be scored
- how different evidence types should be weighted
- what thresholds justify continue / narrow / reframe / stop decisions

This document does not define exact data tooling implementation or final commercial KPI dashboards.

---

# 2. Why This Document Exists

Without a formal metrics and evidence model, M0 validation will drift into one or more weak forms:

- selective anecdote collection
- demo optimism
- architecture-driven interpretation of weak signals
- inability to compare results across users or scenarios
- inability to tell the difference between curiosity, value, and adoption potential

Therefore, M0 must have a formal evidence discipline.

---

# 3. Canonical Principle

## 3.1 Core Success Principle

TracePilot M0 is successful only if there is credible evidence that users experience a materially better continuity/control/correction workflow than their realistic baseline, and that this difference is strong enough to justify continued use or deeper validation.

## 3.2 Evidence Principle

No single positive interview, strong demo, or conceptual endorsement is sufficient.

M0 decisions must be based on **aggregated evidence across**:

- pain evidence
- scenario evidence
- wow-moment evidence
- death-path evidence
- adoption evidence

## 3.3 Decision Principle

M0 is not judged by architecture quality alone.
It is judged by whether evidence justifies continuing investment in this wedge.

---

# 4. Evidence Classes

All M0 validation evidence must be classified into one of the following classes.

## 4.1 Class A — Pain Evidence

Evidence that the target user experiences the problem strongly and repeatedly enough to matter.

Examples:
- repeated stories of interruption, change pain, drift, or context reconstruction
- high-cost or frequent manual recovery behavior
- clear articulation of why current baseline is painful

## 4.2 Class B — Baseline Workflow Evidence

Evidence about what the user does today and what is already “good enough.”

Examples:
- current tools used
- current recovery habits
- tolerated workarounds
- why existing methods are or are not sufficient

## 4.3 Class C — Wow-Moment Evidence

Evidence that the user experiences a clear and meaningful “this is materially better” moment.

Examples:
- spontaneous wow language
- immediate recognition of change/continuation value
- user-generated restatement of the product value in their own words

## 4.4 Class D — Scenario Performance Evidence

Evidence that TracePilot performs meaningfully within one or more canonical scenarios.

Examples:
- successful requirement-change continuation
- successful interrupted-work resumption
- meaningful drift detection and correction support
- useful change impact clarification

## 4.5 Class E — Trust Evidence

Evidence that the user finds the system understandable and trustworthy enough to rely on in real work.

Examples:
- user accepts explanation as grounded
- user says they would act on the output
- user does not feel forced to manually rebuild everything anyway

## 4.6 Class F — Adoption Evidence

Evidence that the user would continue using, trial, or recommend the product in real workflows.

Examples:
- repeat-use intent
- willingness to test on real project
- workflow integration interest
- credible willingness-to-pay or buyer handoff signal

## 4.7 Class G — Failure / Death-Path Evidence

Evidence that one or more fatal or severe death paths are active.

Examples:
- weak pain reality
- no meaningful differentiation
- excessive overhead
- persistent distrust
- no credible adoption path

---

# 5. Success Dimensions

M0 must be evaluated across the following seven success dimensions.

## 5.1 Pain Intensity

How real, frequent, and costly is the target user pain?

## 5.2 Baseline Weakness

How inadequate is the user’s current workflow or workaround relative to the problem?

## 5.3 Wow Strength

How strongly does TracePilot produce a meaningful perceived difference?

## 5.4 Scenario Effectiveness

How well does TracePilot perform in realistic M0 scenarios?

## 5.5 Trustworthiness

How much does the user trust TracePilot’s continuation, impact, or correction guidance?

## 5.6 Adoption Pull

How strongly does the user want to continue using or trialing the product?

## 5.7 Failure Risk

How active are severe or fatal death paths in the tested cohort?

---

# 6. Metric Scale Model

Each success dimension should be scored on a 5-point scale unless otherwise specified.

## 6.1 Standard 5-Point Scale

- **1 — Very Weak / Absent**
- **2 — Weak**
- **3 — Mixed / Moderate**
- **4 — Strong**
- **5 — Very Strong**

## 6.2 Interpretation Rule

A score of 3 means “inconclusive or mixed,” not “good enough.”

Strong continuation decisions should generally require repeatable 4–5 level evidence on key dimensions.

---

# 7. Dimension Definitions and Scoring Guidance

## 7.1 Pain Intensity Score

### Definition
Measures how strongly and repeatedly the user experiences the target problem.

### Scoring Guidance
- **1**: pain is mostly hypothetical or rare
- **2**: pain exists but is low-cost or infrequent
- **3**: pain is real but inconsistent or manageable
- **4**: pain is recurring and meaningfully costly
- **5**: pain is intense, frequent, and clearly high-value to solve

## 7.2 Baseline Weakness Score

### Definition
Measures how weak or insufficient the current baseline workflow is.

### Scoring Guidance
- **1**: baseline already good enough
- **2**: baseline has annoyance but little real weakness
- **3**: baseline is imperfect but serviceable
- **4**: baseline is clearly fragile or costly
- **5**: baseline is painfully inadequate and widely disliked

## 7.3 Wow Strength Score

### Definition
Measures how strongly TracePilot creates a felt product difference.

### Scoring Guidance
- **1**: no wow or no meaningful difference
- **2**: slight interest, little felt difference
- **3**: value is visible but not striking
- **4**: clear meaningful wow moment
- **5**: strong, memorable, user-articulated difference

## 7.4 Scenario Effectiveness Score

### Definition
Measures how well TracePilot performs within the tested scenario.

### Scoring Guidance
- **1**: scenario fails or produces little value
- **2**: some behavior works, but not product-level useful
- **3**: mixed scenario performance, partial value
- **4**: scenario consistently creates meaningful value
- **5**: scenario strongly proves the wedge in user-visible terms

## 7.5 Trustworthiness Score

### Definition
Measures how much users trust and understand TracePilot’s output enough to act on it.

### Scoring Guidance
- **1**: user does not trust or understand the output
- **2**: user sees value but still distrusts heavily
- **3**: mixed trust; user still double-checks most things manually
- **4**: user finds output understandable and reasonably dependable
- **5**: user strongly trusts the continuation/correction logic in the scenario

## 7.6 Adoption Pull Score

### Definition
Measures the strength of real usage intent.

### Scoring Guidance
- **1**: no credible use intent
- **2**: polite interest only
- **3**: willing to try once or in curiosity mode
- **4**: credible intent to use in real workflow
- **5**: strong repeated-use or championing signal

## 7.7 Failure Risk Score

### Definition
Measures how active severe/fatal death paths are.

### Scoring Guidance
- **1**: no meaningful death-path activity observed
- **2**: minor warning signals only
- **3**: one or more serious but manageable risks visible
- **4**: severe death-path activity active
- **5**: fatal death-path activity dominant

### Interpretation Rule
For this dimension, **lower is better**.

---

# 8. Metric Weighting Model

Not all dimensions should be weighted equally for M0.

## 8.1 Recommended Weighting

- **Pain Intensity**: 20%
- **Baseline Weakness**: 10%
- **Wow Strength**: 20%
- **Scenario Effectiveness**: 20%
- **Trustworthiness**: 15%
- **Adoption Pull**: 15%
- **Failure Risk**: gating dimension, not simply additive

## 8.2 Weighting Rationale

M0 must first prove:
- the pain is real
- the product difference is felt
- the scenario works
- users trust it enough to continue

Failure risk is treated as a gating factor because a single fatal death path can invalidate otherwise promising scores.

---

# 9. Evidence Collection Model

Each validation session should generate a structured evidence packet.

## 9.1 Minimum Evidence Packet Fields

- participant identifier class (anonymized if needed)
- cohort classification
- workflow type
- scenario tested
- baseline workflow description
- pain evidence summary
- wow moment observed? (yes/no/partial)
- trust evidence summary
- adoption signal summary
- death-path signals observed
- dimension scores
- interviewer confidence note
- notable quotes (supportive and skeptical)

## 9.2 Evidence Packet Rule

No session should count toward M0 synthesis unless it produces a minimally complete evidence packet.

---

# 10. Evidence Strength Levels

All evidence should be labeled by strength.

## 10.1 Level 1 — Weak Evidence

- abstract agreement
- hypothetical interest
- architecture praise
- vague positive language without concrete pain or use case

## 10.2 Level 2 — Moderate Evidence

- clear pain story
- meaningful comparison against baseline
- partial wow reaction
- plausible trial interest

## 10.3 Level 3 — Strong Evidence

- repeated real pain story
- strong wow moment
- strong differentiation signal
- credible repeated-use intent
- user clearly identifies where TracePilot fits into real workflow

## 10.4 Strength Rule

M0 should not be considered validated based mainly on Level 1 evidence.

---

# 11. Aggregation Rules

## 11.1 Per-Interview Scoring

Each interview or scenario session should produce a score vector across all seven success dimensions.

## 11.2 Cohort Aggregation

Results should be aggregated by:

- user cohort
- scenario class
- interview mode
- wow-moment type

## 11.3 Outlier Handling

A single very strong demo reaction or a single negative reaction must not dominate synthesis without context.

## 11.4 Pattern Rule

Decisions should be based on repeated patterns, not isolated anecdotes.

---

# 12. Success Threshold Model

The following thresholds define the default M0 decision logic.

## 12.1 Continue Threshold

A **Continue** recommendation requires all of the following:

- Pain Intensity average ≥ 4.0 in the core target cohort
- Wow Strength average ≥ 4.0 in at least one primary scenario
- Scenario Effectiveness average ≥ 4.0 in at least one primary scenario
- Trustworthiness average ≥ 3.5 in that same scenario cluster
- Adoption Pull average ≥ 3.5 in the target cohort
- no dominant Failure Risk pattern at severity 4–5 across the core cohort

## 12.2 Narrow and Iterate Threshold

A **Narrow and Iterate** recommendation applies when:

- one scenario produces promising wow and scenario scores
- but trust, adoption, or overhead concerns remain mixed
- and failure risk is present but not fatal

Typical pattern:
- Wow Strength 3.5–4.0
- Scenario Effectiveness 3.5–4.0
- Trustworthiness 2.5–3.5
- Adoption Pull 2.5–3.5
- Failure Risk around 3

## 12.3 Reframe Threshold

A **Reframe** recommendation applies when:

- there is clear pain, but not for the originally framed user/value language
- or value is real, but it lands with a different user/buyer than expected
- or the strongest validated scenario differs from the current product story

## 12.4 Stop / Reset Threshold

A **Stop / Reset** recommendation applies when one or more of the following persist:

- Pain Intensity average < 3.0 in the core target cohort
- Wow Strength average < 3.0 across primary scenarios
- Scenario Effectiveness average < 3.0
- Adoption Pull average < 2.5
- Failure Risk average ≥ 4.0 or a fatal death path is dominant

---

# 13. Fatal Gating Rules

Regardless of weighted averages, the following conditions should block M0 success claims.

## 13.1 Pain Reality Gate

If the target problem is not repeatedly real and painful in the chosen cohort, M0 fails.

## 13.2 Differentiation Gate

If users do not perceive TracePilot as meaningfully different from baseline workflows, M0 fails.

## 13.3 Adoption Gate

If users show only conceptual interest but no credible usage intent, M0 fails.

## 13.4 Projection Drift Gate

If a seeming product success depends on violating mother-runtime boundaries or faking the projection/runtime distinction, M0 does not count as valid success.

---

# 14. Quantitative vs Qualitative Evidence Rule

## 14.1 Rule

M0 evidence must combine:

- **qualitative evidence**: pain stories, wow language, objections, trust language
- **structured scoring**: dimension scores and scenario results

## 14.2 Anti-False-Precision Rule

The scoring model is intended to discipline judgment, not pretend early-stage discovery is a fully deterministic science.

## 14.3 Anti-Vagueness Rule

Conversely, qualitative richness must not be used as an excuse to avoid go/no-go discipline.

---

# 15. Evidence Interpretation Rules

## 15.1 Interest Is Not Adoption

Users saying the idea is good does not equal willingness to adopt.

## 15.2 Trust Matters More Than Novelty

A visually impressive demo without trust and explanation is weak evidence.

## 15.3 Pain-Dense Cohorts Matter More Than Broad Weak Curiosity

A small high-pain cohort with strong scores is more meaningful than a broad cohort with weak enthusiasm.

## 15.4 Repeated Use Signals Matter More Than Single Wow Reactions

A wow moment is necessary but not sufficient if it does not translate into usage pull.

---

# 16. Evidence Output Model

At the end of each synthesis cycle, the team should produce at least the following outputs.

## 16.1 M0 Validation Summary

A concise summary of:
- strongest evidence
- weakest evidence
- active death paths
- recommended next action

## 16.2 Cohort Scorecard

A structured view of dimension scores by cohort and scenario.

## 16.3 Scenario Scorecard

A structured view of wow, trust, adoption, and failure risk by scenario class.

## 16.4 Decision Memo

A memo stating whether the current recommendation is:
- Continue
- Narrow and Iterate
- Reframe
- Stop / Reset

---

# 17. Relationship to Other M0 Documents

## 17.1 Relationship to First Wow Moment & Validation Spec

That document defines what M0 must prove.
This document defines how success will be measured and evidenced.

## 17.2 Relationship to Death Paths & Failure Matrix

That document defines how M0 may fail.
This document defines how failure risk is measured and how it affects decisions.

## 17.3 Relationship to Validation Interview Framework

That document defines how evidence is gathered from interviews.
This document defines how that evidence is structured and interpreted.

## 17.4 Relationship to Scenario Pack

That document defines the testing environments.
This document defines how performance in those environments counts toward M0 success.

---

# 18. Relationship to Coregentis Mother Architecture

## 18.1 Rule

This is a TracePilot projection-stage evidence and decision model. It is not a constitutional runtime document.

## 18.2 Constraint

Metrics and thresholds may be used to decide product direction, but they must not justify violating Coregentis runtime boundaries for superficial M0 success.

## 18.3 Positive Use

This document should help determine:

- whether the current TracePilot wedge is viable
- which scenario and cohort deserve priority
- whether the current profile should be narrowed or reframed

---

# 19. Validation Invariants

The following invariants must hold.

## 19.1 Evidence Over Enthusiasm Invariant

M0 decisions must be evidence-backed, not excitement-backed.

## 19.2 Pain Over Praise Invariant

Repeated real pain matters more than praise.

## 19.3 Adoption Over Curiosity Invariant

Repeat-use intent matters more than conceptual interest.

## 19.4 Failure Gating Invariant

Fatal death paths block success claims even when other scores look promising.

## 19.5 Boundary Fidelity Invariant

No metric-based shortcut may legitimize breaking product/runtime/protocol boundaries.

---

# 20. Non-Goals

This document does not define:

- exact analytics implementation
- exact participant sample size
- exact business KPI dashboard
- pricing experiment methodology
- enterprise sales qualification logic

These belong to downstream operational documents.

---

# 21. Required Follow-On Documents

The following downstream documents are recommended.

1. **TracePilot — M0 Cohort Definition v0.1**
2. **TracePilot — Validation Synthesis Template v0.1**
3. **TracePilot — Runtime Profile Spec v0.1**
4. **TracePilot — M0 Evidence Packet Template v0.1**
5. **TracePilot — M0 Decision Memo Template v0.1**

---

# 22. Open Questions

The following questions remain open.

- What is the minimum sample quality required before threshold interpretation is meaningful?
- Which scenario should count as the primary weighted scenario in early M0?
- Which cohort should be treated as authoritative when signals conflict?
- What confidence modifiers should apply when evidence quantity is still low?
- Which adoption signal should count as the first truly meaningful go-forward marker?

---

# 23. Freeze Statement

This document establishes the first success metrics and evidence model baseline for TracePilot M0.

TracePilot M0 must be judged through explicit evidence classes, structured success dimensions, fatal gating rules, and clear continue/narrow/reframe/stop thresholds—not through architecture confidence, demo aesthetics, or isolated enthusiasm.

No M0 success claim should be accepted unless it satisfies this evidence discipline.

