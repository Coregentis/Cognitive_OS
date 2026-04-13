# CGOS-RUNTIME-CONSUMPTION-GUIDE-v0.1

## Purpose

This guide gives the minimum safe usage rules for a downstream projection layer consuming the current mother-runtime surface.

## Consume It Like This

- read workforce schemas as mother-runtime object truth
- read registry / binding / export truth before mapping any projection DTOs
- treat lifecycle, persistence, and bounded P0-B learning glue as reusable runtime services
- wrap execution envelopes and bounded dispatcher results in projection-owned adapters
- keep all provider-specific code downstream

## Do Not Consume It Like This

- do not treat bounded dispatcher glue as a full orchestration engine
- do not treat correction capture and preference write-back as a full autonomous learning system
- do not expose raw mother-runtime types directly as final product DTOs without a projection boundary
- do not put product workflow state back into mother-runtime files as if product were authoritative

## Recommended Downstream Pattern

1. map neutral workforce objects to product vocabulary in Projection
2. build projection-owned read models over mother-runtime stores
3. supply provider adapters outside `Cognitive_OS`
4. keep product workflow assembly in Projection or App layers
