---
title: Combat walkthroughs
description: Worked battle examples with every number shown, so you can check the maths yourself.
---

These are worked examples of combat with **every number shown**, so you can follow the maths by hand and see how armies, tiers and troop types play out. Each example was run through the game's battle resolver and the numbers below match it.

All battles below use **no random roll** (roll = 1.000 for both sides) so the numbers are exactly reproducible; section 8 shows what the real ±5% roll does.

:::note
Troop stats are starting values and may be rebalanced after more playtesting. The rules are summarised on the [Combat rules](../rules/) page.
:::

## 1. The rules, step by step

A battle takes two armies, each a list of **groups** (one group = one troop type at one tier, one owner). It resolves instantly on the server.

1. **Setup.** For every group: `pool = troops × HP` (its total hit points), `ATK`, `DEF`. Each side gets one **roll** between 0.95 and 1.05 (the only randomness; 1.000 in this document).
2. **Repeat rounds until one side has no troops** (a hard cap of 50 rounds only guards against loops). In each round, **all groups act simultaneously**, using the number of troops alive at the start of the round: `troops alive = ceil(pool / HP)`.
3. **A group's raw damage** = `troops alive × ATK × its side's roll`.
4. **Who it hits.** The enemy's **front line** is the first type that still has living troops in this order: **infantry, cavalry, archers, siege**.
   - 80% of the raw damage goes to the front-line type.
   - 20% goes to the type this group **counters** (infantry→cavalry→archers→siege→infantry) if that type still lives. If it is dead, the full 100% goes to the front line.
5. **Counter bonus.** A damage portion that lands on the type the attacker counters is multiplied by **1.25**. This is by the TARGET TYPE of the portion, not by which share it is: if the front line itself happens to be the countered type (e.g. archers attacking an army that only has siege left), both portions get the ×1.25.
6. **Spread over the target type.** Within the target type the damage is split between that side's groups of that type in proportion to each group's **current pool** (so tiers and owners share it by HP).
7. **DEF mitigation.** What a target group finally takes is `share × amount × counter bonus × 100 / (100 + target DEF)`. DEF 42 means it takes 70.4% of the damage; DEF 100 means 50%.
8. **Apply.** Pools drop by the damage received (not below 0). Damage above what a group had left is **wasted** (overkill is not passed on to other groups).
9. **Winner.** The side that still has troops. (If both are wiped in the same round, or the 50-round cap is hit, the side with the higher % of its starting HP left wins, ties to the defender.)
10. **Afterwards.** Losses are split into **dead and wounded** (see section 6), survivors go home, kills are counted, and loot and shields are handled.

### Things worth knowing

- **No defender bonus** and no special siege rule.
- **Overkill is wasted.** A strong group hitting a small front line burns most of its damage on it; nothing spills over to the next type.
- **The counter only matters for 20% of the damage** (plus the front-line case in point 5). In a mixed army the "rock-paper-scissors" effect is small; most damage goes to whatever stands at the front.
- **Simultaneous rounds.** A group that dies this round still dealt its full damage this round.
- **Tier steps** are worth about what they cost to train and about their Power (scenario 1b): HP grows about 29% per tier and ATK / DEF faster, but each step also costs more.
- **The 50-round safety cap is not just a safety net.** Even fights between big, high-DEF armies take 40 to 50+ rounds, because each round only removes a few percent of the HP. When the cap is reached nobody has been wiped out and the side with the higher % of starting HP left wins (section 3b shows when this happens: scenario 5 below is decided by it).
- **The roll is one multiplier per side for the whole battle**, not per round.
- The stats are the table in section 2. They are **starting values** that may be rebalanced after more playtesting.

## 2. The numbers in play

HP / ATK / DEF per troop, and the training cost (sum of all resources, the yardstick the balance was tuned against).

| Tier | Infantry HP/ATK/DEF (cost) | Cavalry HP/ATK/DEF (cost) | Archers HP/ATK/DEF (cost) | Siege HP/ATK/DEF (cost) |
|---:|---|---|---|---|
| T1 | 120 / 8 / 10 (70) | 110 / 24 / 7 (120) | 90 / 16 / 3 (85) | 80 / 85 / 4 (180) |
| T2 | 155 / 14 / 15 (110) | 142 / 43 / 11 (185) | 116 / 28 / 5 (135) | 103 / 141 / 6 (290) |
| T3 | 200 / 24 / 22 (180) | 183 / 69 / 16 (282) | 150 / 44 / 8 (200) | 133 / 211 / 9 (420) |
| T4 | 259 / 38 / 32 (260) | 237 / 106 / 23 (387) | 194 / 67 / 13 (279) | 172 / 301 / 13 (570) |
| T5 | 334 / 51 / 42 (350) | 306 / 139 / 29 (507) | 250 / 87 / 18 (373) | 223 / 367 / 17 (740) |
| T6 | 431 / 66 / 54 (460) | 395 / 172 / 38 (642) | 323 / 109 / 24 (481) | 288 / 456 / 22 (930) |
| T7 | 557 / 75 / 68 (630) | 511 / 191 / 48 (843) | 418 / 124 / 32 (634) | 371 / 507 / 27 (1190) |
| T8 | 719 / 85 / 85 (790) | 659 / 211 / 59 (1028) | 540 / 139 / 42 (787) | 480 / 558 / 34 (1440) |
| T9 | 929 / 95 / 105 (960) | 852 / 227 / 74 (1232) | 697 / 153 / 53 (957) | 619 / 602 / 42 (1712) |
| T10 | 1,200 / 105 / 128 (1160) | 1,100 / 246 / 90 (1455) | 900 / 168 / 68 (1143) | 800 / 651 / 51 (2006) |

Power per troop is the same for every type at a tier: T1=5, T2=8, T3=12, T4=17, T5=23, T6=30, T7=38, T8=47, T9=58, T10=70 (it feeds no fight).

Roles by design: **infantry = meat shield** (lowest ATK, highest DEF and HP), **siege = glass cannon** (≈6× infantry damage, lowest DEF and HP), cavalry strong ATK / weak DEF, archers in between. Cycle: infantry > cavalry > archers > siege > infantry.

## 3. Scenario 1: the simplest fight, same type and tier, 1,000 vs 900 Tier-5 infantry

| Group | Troops | ATK | DEF | HP each | Total HP pool | Damage taken per 100 raw (DEF mitigation) |
|---|---:|---:|---:|---:|---:|---:|
| A1 Infantry T5 (attacker) | 1,000 | 51 | 42 | 334 | 334,000 | 70.4 |
| D1 Infantry T5 (defender) | 900 | 51 | 42 | 334 | 300,600 | 70.4 |

Round 1 in full, to see every step:

**Round 1** (all groups act at the same time, using the troops alive at the START of the round)

- **A1 Infantry T5 (attacker)**: 1,000 troops alive × ATK 51 × roll 1.000 = **51,000.0** raw damage
  - 100% (front line (no living enemy of the countered type)) → Infantry: 51,000.0
    - on D1 Infantry T5 (defender): × 100.0% of that type's HP × 100/(100+42) = 0.704 → **35,915.5** HP removed (pool 300,600.0 → 264,684.5)
- **D1 Infantry T5 (defender)**: 900 troops alive × ATK 51 × roll 1.000 = **45,900.0** raw damage
  - 100% (front line (no living enemy of the countered type)) → Infantry: 45,900.0
    - on A1 Infantry T5 (attacker): × 100.0% of that type's HP × 100/(100+42) = 0.704 → **32,323.9** HP removed (pool 334,000.0 → 301,676.1)

After round 1: A1 904 troops (301,676 HP), D1 793 troops (264,685 HP)

Troops alive after each round:

| Round | A1 | D1 |
|---:|---:|---:|
| 0 | 1,000 | 900 |
| 1 | 904 | 793 |
| 2 | 818 | 696 |
| 3 | 744 | 608 |
| 4 | 678 | 528 |
| 6 | 573 | 388 |
| 8 | 496 | 269 |
| 10 | 444 | 166 |
| 12 | 413 | 72 |
| 14 | 402 | 0 |


**Winner: attacker** after **14 rounds**. Attacker HP left 40.2%, defender HP left 0.0%.

| Group | Started | Survived | Lost | Lost % | Damage dealt (HP) |
|---|---:|---:|---:|---:|---:|
| A1 Infantry T5 (attacker) | 1,000 | 402 | 598 | 59.8% | 300,600 |
| D1 Infantry T5 (defender) | 900 | 0 | 900 | 100.0% | 199,798 |


**What to notice:** both sides hit each other's only group (so 100% goes there, the counter type, cavalry, is absent). The bigger army wins with a lot left: because damage is proportional to the troops alive, an army that is 11% bigger ends the fight with about 40.2% of its troops, not 11%. The fight is "winner takes most": a small lead snowballs.

### Scenario 1b: how much does a tier matter? Troops of the tier below needed to beat 1,000 troops of a tier (same type, no roll)

| Defender | Infantry: lower-tier troops needed | Cavalry | Archers | Siege |
|---|---:|---:|---:|---:|
| 1,000 T2 | 1,538 | 1,550 | 1,517 | 1,695 |
| 1,000 T3 | 1,533 | 1,471 | 1,446 | 1,933 |
| 1,000 T4 | 1,490 | 1,453 | 1,436 | 2,077 |
| 1,000 T5 | 1,365 | 1,333 | 1,323 | 1,889 |
| 1,000 T6 | 1,346 | 1,308 | 1,305 | 1,748 |
| 1,000 T7 | 1,266 | 1,242 | 1,253 | 1,443 |
| 1,000 T8 | 1,270 | 1,238 | 1,249 | 1,226 |
| 1,000 T9 | 1,266 | 1,234 | 1,238 | 1,215 |
| 1,000 T10 | 1,261 | 1,237 | 1,248 | 1,220 |

Compare with the cost and Power ratio of the same tier step (infantry):

| Step | Troops of the lower tier needed (from the table) | Training cost ratio | Power ratio |
|---|---:|---:|---:|
| T1 → T2 | ×1.54 | ×1.57 | ×1.60 |
| T2 → T3 | ×1.53 | ×1.64 | ×1.50 |
| T3 → T4 | ×1.49 | ×1.44 | ×1.42 |
| T4 → T5 | ×1.36 | ×1.35 | ×1.35 |
| T5 → T6 | ×1.35 | ×1.31 | ×1.30 |
| T6 → T7 | ×1.27 | ×1.37 | ×1.27 |
| T7 → T8 | ×1.27 | ×1.25 | ×1.24 |
| T8 → T9 | ×1.27 | ×1.22 | ×1.23 |
| T9 → T10 | ×1.26 | ×1.21 | ×1.21 |

So a tier step is worth roughly what it costs to train and roughly its Power, with deviations of a few percent for infantry (the balance target is equal cost, equal strength). The notable outlier is **siege in the middle tiers** (T3 to T7): the lower-tier siege needed is ×1.4 to ×2.1 while the cost ratio of those steps is only ×1.26 to ×1.45, so a siege tier step there is worth much more than it costs. See the other columns of the table above for cavalry and archers.

## 3b. How long fights take, and the 50-round cap

Rounds to finish (no roll) for same-tier, same-type fights. A fight that reaches 50 is decided by HP% left, not by wiping a side out.

| Tier | Infantry 1,000 vs 1,000 | Infantry 1,000 vs 900 | Infantry 1,000 vs 600 | Cavalry 1,000 vs 1,000 |
|---|---:|---:|---:|---:|
| T1 | 50 | 25 | 12 | 34 |
| T3 | 50 | 15 | 8 | 19 |
| T5 | 50 | 14 | 7 | 17 |
| T7 | 50 | 19 | 9 | 27 |
| T10 | 50 | 39 | 19 | 50 |

Fights between roughly equal armies hit the cap; clear mismatches finish in well under 20 rounds. Fights are shortest around tiers 3 to 5 and longest at tier 10, where DEF mitigation is strongest and a round removes only a few percent of the HP.

## 4. Scenario 2: the counter cycle at equal training cost (Tier 5, 100,000 resources of troops each)

Equal cost is the yardstick the stats were tuned on. Troop counts: 286 Infantry (cost 350 each), 197 Cavalry (cost 507 each), 268 Archers (cost 373 each), 135 Siege (cost 740 each).

Every pairing (row = attacker, column = defender), winner and troops the winner keeps (no roll):

| Attacker \ Defender | Infantry | Cavalry | Archers | Siege |
|---|---|---|---|---|
| Infantry | defender wins, keeps 0.3% (50r) | attacker wins, keeps 31.1% (8r) | attacker wins, keeps 21.7% (12r) | defender wins, keeps 20.7% (4r) |
| Cavalry | defender wins, keeps 31.1% (8r) | defender wins, keeps 0.0% (14r) | attacker wins, keeps 44.2% (4r) | attacker wins, keeps 21.8% (2r) |
| Archers | defender wins, keeps 21.7% (12r) | defender wins, keeps 44.2% (4r) | defender wins, keeps 0.0% (18r) | attacker wins, keeps 26.5% (2r) |
| Siege | attacker wins, keeps 20.7% (4r) | defender wins, keeps 21.8% (2r) | defender wins, keeps 26.5% (2r) | defender wins, keeps 0.0% (1r) |

Reading the table: cavalry beat archers, archers beat siege, siege beat infantry, infantry beat cavalry (the cycle), and the "diagonals" (infantry vs archers, cavalry vs siege) follow from the stats.

### Scenario 2 in detail: cavalry (attacker) vs archers (defender), equal cost

| Group | Troops | ATK | DEF | HP each | Total HP pool | Damage taken per 100 raw (DEF mitigation) |
|---|---:|---:|---:|---:|---:|---:|
| A1 Cavalry T5 (attacker) | 197 | 139 | 29 | 306 | 60,282 | 77.5 |
| D1 Archers T5 (defender) | 268 | 87 | 18 | 250 | 67,000 | 84.7 |

Round 1 in full:

**Round 1** (all groups act at the same time, using the troops alive at the START of the round)

- **A1 Cavalry T5 (attacker)**: 197 troops alive × ATK 139 × roll 1.000 = **27,383.0** raw damage
  - 80% (front line) → Archers: 21,906.4 × 1.25 counter bonus = 27,383.0
    - on D1 Archers T5 (defender): × 100.0% of that type's HP × 100/(100+18) = 0.847 → **23,205.9** HP removed (pool 67,000.0 → 43,794.1)
  - 20% (counter) → Archers: 5,476.6 × 1.25 counter bonus = 6,845.8
    - on D1 Archers T5 (defender): × 100.0% of that type's HP × 100/(100+18) = 0.847 → **5,801.5** HP removed (pool 67,000.0 → 61,198.5)
- **D1 Archers T5 (defender)**: 268 troops alive × ATK 87 × roll 1.000 = **23,316.0** raw damage
  - 100% (front line (no living enemy of the countered type)) → Cavalry: 23,316.0
    - on A1 Cavalry T5 (attacker): × 100.0% of that type's HP × 100/(100+29) = 0.775 → **18,074.4** HP removed (pool 60,282.0 → 42,207.6)

After round 1: A1 138 troops (42,208 HP), D1 152 troops (37,993 HP)

Round 2 in full (the archers have already lost troops, so they deal less than in round 1):

**Round 2** (all groups act at the same time, using the troops alive at the START of the round)

- **A1 Cavalry T5 (attacker)**: 138 troops alive × ATK 139 × roll 1.000 = **19,182.0** raw damage
  - 80% (front line) → Archers: 15,345.6 × 1.25 counter bonus = 19,182.0
    - on D1 Archers T5 (defender): × 100.0% of that type's HP × 100/(100+18) = 0.847 → **16,255.9** HP removed (pool 37,992.6 → 21,736.7)
  - 20% (counter) → Archers: 3,836.4 × 1.25 counter bonus = 4,795.5
    - on D1 Archers T5 (defender): × 100.0% of that type's HP × 100/(100+18) = 0.847 → **4,064.0** HP removed (pool 37,992.6 → 33,928.6)
- **D1 Archers T5 (defender)**: 152 troops alive × ATK 87 × roll 1.000 = **13,224.0** raw damage
  - 100% (front line (no living enemy of the countered type)) → Cavalry: 13,224.0
    - on A1 Cavalry T5 (attacker): × 100.0% of that type's HP × 100/(100+29) = 0.775 → **10,251.2** HP removed (pool 42,207.6 → 31,956.4)

After round 2: A1 105 troops (31,956 HP), D1 71 troops (17,673 HP)

Troops alive after each round:

| Round | A1 | D1 |
|---:|---:|---:|
| 0 | 197 | 268 |
| 1 | 138 | 152 |
| 2 | 105 | 71 |
| 3 | 89 | 9 |
| 4 | 87 | 0 |


**Winner: attacker** after **4 rounds**. Attacker HP left 44.1%, defender HP left 0.0%.

| Group | Started | Survived | Lost | Lost % | Damage dealt (HP) |
|---|---:|---:|---:|---:|---:|
| A1 Cavalry T5 (attacker) | 197 | 87 | 110 | 55.8% | 69,212 |
| D1 Archers T5 (defender) | 268 | 0 | 268 | 100.0% | 33,721 |


**What to notice:** the cavalry's counter bonus is the ×1.25 line: because the archers are the ONLY enemy type, the front line IS the countered type, so both the 80% and the 20% portion get the bonus (rule 5). The archers hit back at the cavalry with ATK 87 against DEF 29.

## 5. Scenario 3: mixed armies, Tier 5, how the 80% / 20% targeting plays out

Attacker: 600 infantry, 300 cavalry, 200 archers. Defender: 500 infantry, 500 archers, 100 siege.

| Group | Troops | ATK | DEF | HP each | Total HP pool | Damage taken per 100 raw (DEF mitigation) |
|---|---:|---:|---:|---:|---:|---:|
| A1 Infantry T5 (attacker) | 600 | 51 | 42 | 334 | 200,400 | 70.4 |
| A2 Cavalry T5 (attacker) | 300 | 139 | 29 | 306 | 91,800 | 77.5 |
| A3 Archers T5 (attacker) | 200 | 87 | 18 | 250 | 50,000 | 84.7 |
| D1 Infantry T5 (defender) | 500 | 51 | 42 | 334 | 167,000 | 70.4 |
| D2 Archers T5 (defender) | 500 | 87 | 18 | 250 | 125,000 | 84.7 |
| D3 Siege T5 (defender) | 100 | 367 | 17 | 223 | 22,300 | 85.5 |

Round 1 in full. Watch where each group's damage goes (front line = infantry on both sides while any infantry lives; the 20% share goes to the countered type if it exists):

**Round 1** (all groups act at the same time, using the troops alive at the START of the round)

- **A1 Infantry T5 (attacker)**: 600 troops alive × ATK 51 × roll 1.000 = **30,600.0** raw damage
  - 100% (front line (no living enemy of the countered type)) → Infantry: 30,600.0
    - on D1 Infantry T5 (defender): × 100.0% of that type's HP × 100/(100+42) = 0.704 → **21,549.3** HP removed (pool 167,000.0 → 145,450.7)
- **A2 Cavalry T5 (attacker)**: 300 troops alive × ATK 139 × roll 1.000 = **41,700.0** raw damage
  - 80% (front line) → Infantry: 33,360.0
    - on D1 Infantry T5 (defender): × 100.0% of that type's HP × 100/(100+42) = 0.704 → **23,493.0** HP removed (pool 167,000.0 → 143,507.0)
  - 20% (counter) → Archers: 8,340.0 × 1.25 counter bonus = 10,425.0
    - on D2 Archers T5 (defender): × 100.0% of that type's HP × 100/(100+18) = 0.847 → **8,834.7** HP removed (pool 125,000.0 → 116,165.3)
- **A3 Archers T5 (attacker)**: 200 troops alive × ATK 87 × roll 1.000 = **17,400.0** raw damage
  - 80% (front line) → Infantry: 13,920.0
    - on D1 Infantry T5 (defender): × 100.0% of that type's HP × 100/(100+42) = 0.704 → **9,802.8** HP removed (pool 167,000.0 → 157,197.2)
  - 20% (counter) → Siege: 3,480.0 × 1.25 counter bonus = 4,350.0
    - on D3 Siege T5 (defender): × 100.0% of that type's HP × 100/(100+17) = 0.855 → **3,717.9** HP removed (pool 22,300.0 → 18,582.1)
- **D1 Infantry T5 (defender)**: 500 troops alive × ATK 51 × roll 1.000 = **25,500.0** raw damage
  - 80% (front line) → Infantry: 20,400.0
    - on A1 Infantry T5 (attacker): × 100.0% of that type's HP × 100/(100+42) = 0.704 → **14,366.2** HP removed (pool 200,400.0 → 186,033.8)
  - 20% (counter) → Cavalry: 5,100.0 × 1.25 counter bonus = 6,375.0
    - on A2 Cavalry T5 (attacker): × 100.0% of that type's HP × 100/(100+29) = 0.775 → **4,941.9** HP removed (pool 91,800.0 → 86,858.1)
- **D2 Archers T5 (defender)**: 500 troops alive × ATK 87 × roll 1.000 = **43,500.0** raw damage
  - 100% (front line (no living enemy of the countered type)) → Infantry: 43,500.0
    - on A1 Infantry T5 (attacker): × 100.0% of that type's HP × 100/(100+42) = 0.704 → **30,633.8** HP removed (pool 200,400.0 → 169,766.2)
- **D3 Siege T5 (defender)**: 100 troops alive × ATK 367 × roll 1.000 = **36,700.0** raw damage
  - 80% (front line) → Infantry: 29,360.0 × 1.25 counter bonus = 36,700.0
    - on A1 Infantry T5 (attacker): × 100.0% of that type's HP × 100/(100+42) = 0.704 → **25,845.1** HP removed (pool 200,400.0 → 174,554.9)
  - 20% (counter) → Infantry: 7,340.0 × 1.25 counter bonus = 9,175.0
    - on A1 Infantry T5 (attacker): × 100.0% of that type's HP × 100/(100+42) = 0.704 → **6,461.3** HP removed (pool 200,400.0 → 193,938.7)

After round 1: A1 369 troops (123,094 HP), A2 284 troops (86,858 HP), A3 200 troops (50,000 HP), D1 336 troops (112,155 HP), D2 465 troops (116,165 HP), D3 84 troops (18,582 HP)

Troops alive after each round:

| Round | A1 | A2 | A3 | D1 | D2 | D3 |
|---:|---:|---:|---:|---:|---:|---:|
| 0 | 600 | 300 | 200 | 500 | 500 | 100 |
| 1 | 369 | 284 | 200 | 336 | 465 | 84 |
| 2 | 174 | 273 | 200 | 201 | 432 | 67 |
| 3 | 12 | 267 | 200 | 89 | 400 | 50 |
| 4 | 0 | 264 | 200 | 0 | 368 | 34 |
| 6 | 0 | 99 | 200 | 0 | 29 | 0 |
| 7 | 0 | 93 | 200 | 0 | 0 | 0 |


**Winner: attacker** after **7 rounds**. Attacker HP left 22.9%, defender HP left 0.0%.

| Group | Started | Survived | Lost | Lost % | Damage dealt (HP) |
|---|---:|---:|---:|---:|---:|
| A1 Infantry T5 (attacker) | 600 | 0 | 600 | 100.0% | 41,482 |
| A2 Cavalry T5 (attacker) | 300 | 93 | 207 | 69.0% | 192,343 |
| A3 Archers T5 (attacker) | 200 | 200 | 0 | 0.0% | 92,303 |
| D1 Infantry T5 (defender) | 500 | 0 | 500 | 100.0% | 43,482 |
| D2 Archers T5 (defender) | 500 | 0 | 500 | 100.0% | 127,418 |
| D3 Siege T5 (defender) | 100 | 0 | 100 | 100.0% | 102,754 |


**What to notice:** the attacking infantry and cavalry both spend 80% of their damage on the defender's infantry (the front line). Only the 20% shares reach the archers (cavalry's counter) and the siege (archers' counter). The defender's siege (ATK 367) is the glass cannon: it deals 36,700 raw damage per round from only 100 troops, all of it on the attacker's front line.

## 6. Scenario 4: a castle with two stationed reinforcements, mixed tiers, and the dead / wounded split

The owner's garrison (700 T5 infantry, 300 T5 archers) is joined by Ally 1 (500 T6 infantry) and Ally 2 (300 T6 cavalry). They fight as ONE army; the owner tags only tell us afterwards who lost what. Attacker: 900 T6 infantry + 700 T6 archers.

| Group | Troops | ATK | DEF | HP each | Total HP pool | Damage taken per 100 raw (DEF mitigation) |
|---|---:|---:|---:|---:|---:|---:|
| A1 Infantry T6 (Attacker) | 900 | 66 | 54 | 431 | 387,900 | 64.9 |
| A2 Archers T6 (Attacker) | 700 | 109 | 24 | 323 | 226,100 | 80.6 |
| D1 Infantry T5 (Owner) | 700 | 51 | 42 | 334 | 233,800 | 70.4 |
| D2 Archers T5 (Owner) | 300 | 87 | 18 | 250 | 75,000 | 84.7 |
| D3 Infantry T6 (Ally 1) | 500 | 66 | 54 | 431 | 215,500 | 64.9 |
| D4 Cavalry T6 (Ally 2) | 300 | 172 | 38 | 395 | 118,500 | 72.5 |

Round 1 in full. Note how the damage on the defending infantry is split between the two infantry groups (Owner T5 and Ally 1 T6) **by their HP pools**, and each then applies its own DEF:

**Round 1** (all groups act at the same time, using the troops alive at the START of the round)

- **A1 Infantry T6 (Attacker)**: 900 troops alive × ATK 66 × roll 1.000 = **59,400.0** raw damage
  - 80% (front line) → Infantry: 47,520.0
    - on D1 Infantry T5 (Owner): × 52.0% of that type's HP × 100/(100+42) = 0.704 → **17,413.9** HP removed (pool 233,800.0 → 216,386.1)
    - on D3 Infantry T6 (Ally 1): × 48.0% of that type's HP × 100/(100+54) = 0.649 → **14,800.2** HP removed (pool 215,500.0 → 200,699.8)
  - 20% (counter) → Cavalry: 11,880.0 × 1.25 counter bonus = 14,850.0
    - on D4 Cavalry T6 (Ally 2): × 100.0% of that type's HP × 100/(100+38) = 0.725 → **10,760.9** HP removed (pool 118,500.0 → 107,739.1)
- **A2 Archers T6 (Attacker)**: 700 troops alive × ATK 109 × roll 1.000 = **76,300.0** raw damage
  - 100% (front line (no living enemy of the countered type)) → Infantry: 76,300.0
    - on D1 Infantry T5 (Owner): × 52.0% of that type's HP × 100/(100+42) = 0.704 → **27,960.5** HP removed (pool 233,800.0 → 205,839.5)
    - on D3 Infantry T6 (Ally 1): × 48.0% of that type's HP × 100/(100+54) = 0.649 → **23,763.7** HP removed (pool 215,500.0 → 191,736.3)
- **D1 Infantry T5 (Owner)**: 700 troops alive × ATK 51 × roll 1.000 = **35,700.0** raw damage
  - 100% (front line (no living enemy of the countered type)) → Infantry: 35,700.0
    - on A1 Infantry T6 (Attacker): × 100.0% of that type's HP × 100/(100+54) = 0.649 → **23,181.8** HP removed (pool 387,900.0 → 364,718.2)
- **D2 Archers T5 (Owner)**: 300 troops alive × ATK 87 × roll 1.000 = **26,100.0** raw damage
  - 100% (front line (no living enemy of the countered type)) → Infantry: 26,100.0
    - on A1 Infantry T6 (Attacker): × 100.0% of that type's HP × 100/(100+54) = 0.649 → **16,948.1** HP removed (pool 387,900.0 → 370,951.9)
- **D3 Infantry T6 (Ally 1)**: 500 troops alive × ATK 66 × roll 1.000 = **33,000.0** raw damage
  - 100% (front line (no living enemy of the countered type)) → Infantry: 33,000.0
    - on A1 Infantry T6 (Attacker): × 100.0% of that type's HP × 100/(100+54) = 0.649 → **21,428.6** HP removed (pool 387,900.0 → 366,471.4)
- **D4 Cavalry T6 (Ally 2)**: 300 troops alive × ATK 172 × roll 1.000 = **51,600.0** raw damage
  - 80% (front line) → Infantry: 41,280.0
    - on A1 Infantry T6 (Attacker): × 100.0% of that type's HP × 100/(100+54) = 0.649 → **26,805.2** HP removed (pool 387,900.0 → 361,094.8)
  - 20% (counter) → Archers: 10,320.0 × 1.25 counter bonus = 12,900.0
    - on A2 Archers T6 (Attacker): × 100.0% of that type's HP × 100/(100+24) = 0.806 → **10,403.2** HP removed (pool 226,100.0 → 215,696.8)

After round 1: A1 695 troops (299,536 HP), A2 668 troops (215,697 HP), D1 565 troops (188,426 HP), D2 300 troops (75,000 HP), D3 411 troops (176,936 HP), D4 273 troops (107,739 HP)

Troops alive after each round:

| Round | A1 | A2 | D1 | D2 | D3 | D4 |
|---:|---:|---:|---:|---:|---:|---:|
| 0 | 900 | 700 | 700 | 300 | 500 | 300 |
| 1 | 695 | 668 | 565 | 300 | 411 | 273 |
| 2 | 515 | 639 | 446 | 300 | 331 | 252 |
| 3 | 357 | 612 | 341 | 300 | 260 | 237 |
| 4 | 216 | 586 | 250 | 300 | 196 | 226 |
| 6 | 0 | 539 | 103 | 300 | 88 | 217 |
| 8 | 0 | 135 | 10 | 300 | 12 | 217 |
| 9 | 0 | 0 | 0 | 300 | 0 | 217 |


**Winner: defender** after **9 rounds**. Attacker HP left 0.0%, defender HP left 24.9%.

| Group | Started | Survived | Lost | Lost % | Damage dealt (HP) |
|---|---:|---:|---:|---:|---:|
| A1 Infantry T6 (Attacker) | 900 | 0 | 900 | 100.0% | 132,396 |
| A2 Archers T6 (Attacker) | 700 | 0 | 700 | 100.0% | 350,072 |
| D1 Infantry T5 (Owner) | 700 | 0 | 700 | 100.0% | 88,355 |
| D2 Archers T5 (Owner) | 300 | 300 | 0 | 0.0% | 164,833 |
| D3 Infantry T6 (Ally 1) | 500 | 0 | 500 | 100.0% | 86,287 |
| D4 Cavalry T6 (Ally 2) | 300 | 217 | 83 | 27.7% | 299,785 |



### Who lost what, and the Hospitals

Losses per owner: Owner 700, Ally 1 500, Ally 2 83; attacker 1,600.

Casualties are **dead or wounded**, decided by each player's own Hospital (capacity **200 wounded per Hospital level**, 1 space per troop; troops already wounded or in the heal queue use space; **when it cannot take everyone the HIGHER tiers are saved first**, the rest die):

- **Castle owner and every reinforcer: ALL losses become wounded** until their own Hospital is full. Example: the owner has a Level-2 Hospital (capacity 400) with 150 wounded already: it has 250 free, so of 700 casualties the first 250 are stored (higher tier first) and 450 die. Ally 1 with a Level-3 Hospital (600 free) stores all 500. Ally 2 has no Hospital: all 83 die.
- **The attacker (PvP): only 20% of the losses become wounded**, the rest die: 1,600 losses → 320 wounded (if the Hospital has room, rounded per group), 1,280 dead.
- **Who suffers is decided by the troop type, not the owner:** in this fight the owner's archers (behind the front line) were never touched, while the owner's infantry and Ally 1's infantry stood in front and died. A guildmate's reinforcement in front of your castle protects what is behind it, and the owner's archers survive.
- **Kills** (Rankings) = every enemy casualty, dead + wounded: the attacker earns 1,283 kills, the defending side 1,600.
- The reinforcements shrink by what they lost; a reinforcement with nobody left is removed.

## 7. Scenario 5: the level-30 PvE camp (2,249 T10 infantry + 900 T10 archers)

Camp garrison = about 22 × 1.173^(level−1) infantry of the tier unlocked at that level, plus 40% as many archers. The player's side has no special treatment: same rules, same stats. Everything the player loses becomes **wounded** (until the Hospital is full); the camp's troops just die.

| Group | Troops | ATK | DEF | HP each | Total HP pool | Damage taken per 100 raw (DEF mitigation) |
|---|---:|---:|---:|---:|---:|---:|
| A1 Infantry T10 (player) | 3,500 | 105 | 128 | 1,200 | 4,200,000 | 43.9 |
| D1 Infantry T10 (camp) | 2,249 | 105 | 128 | 1,200 | 2,698,800 | 43.9 |
| D2 Archers T10 (camp) | 900 | 168 | 68 | 900 | 810,000 | 59.5 |

Different marches against it (no roll):

| March | Winner | Rounds | Player troops left | Player losses |
|---|---|---:|---:|---:|
| 3,500 T10 infantry | attacker | 50 | 260 | 3,240 |
| 3,400 T10 infantry | defender | 42 | 0 | 3,400 |
| 6,000 T7 infantry (full march, lower tier) | defender | 20 | 0 | 6,000 |
| 6,000 T8 infantry | attacker | 26 | 2,079 | 3,921 |
| 3,000 T6 infantry + 3,000 T6 cavalry | attacker | 17 | 1,449 | 4,551 |

The largest march a player can send is 6,000 troops (Drill Grounds Lv30 = 200 per level, plus 50 per Leadership research level). So the top camp needs a strong, **high-tier** march: a full march of tier-8+ infantry or a tier-6+ infantry/cavalry mix wins; tier-7 and lower infantry cannot, however many. The top camp is meant to need a strong march that scales with the tier of your troops.

**Note:** the narrow win (3,500 T10 infantry) is decided by the 50-ROUND CAP, not by annihilation: after 50 rounds 260 of the player's troops and 167 of the camp's (all archers) are still standing, and the player wins because 7.4% of its HP is left against the camp's 4.3%. Tier-10 troops hit each other for only about 44% of their raw damage (DEF 128) against 1,200 HP each, so a round removes only a few percent of the HP. The cap is part of the difficulty of the top camps.

Detail of the narrow win (3,500 T10 infantry), round 1:

**Round 1** (all groups act at the same time, using the troops alive at the START of the round)

- **A1 Infantry T10 (player)**: 3,500 troops alive × ATK 105 × roll 1.000 = **367,500.0** raw damage
  - 100% (front line (no living enemy of the countered type)) → Infantry: 367,500.0
    - on D1 Infantry T10 (camp): × 100.0% of that type's HP × 100/(100+128) = 0.439 → **161,184.2** HP removed (pool 2,698,800.0 → 2,537,615.8)
- **D1 Infantry T10 (camp)**: 2,249 troops alive × ATK 105 × roll 1.000 = **236,145.0** raw damage
  - 100% (front line (no living enemy of the countered type)) → Infantry: 236,145.0
    - on A1 Infantry T10 (player): × 100.0% of that type's HP × 100/(100+128) = 0.439 → **103,572.4** HP removed (pool 4,200,000.0 → 4,096,427.6)
- **D2 Archers T10 (camp)**: 900 troops alive × ATK 168 × roll 1.000 = **151,200.0** raw damage
  - 100% (front line (no living enemy of the countered type)) → Infantry: 151,200.0
    - on A1 Infantry T10 (player): × 100.0% of that type's HP × 100/(100+128) = 0.439 → **66,315.8** HP removed (pool 4,200,000.0 → 4,133,684.2)

After round 1: A1 3,359 troops (4,030,112 HP), D1 2,115 troops (2,537,616 HP), D2 900 troops (810,000 HP)

Troops alive after each round:

| Round | A1 | D1 | D2 |
|---:|---:|---:|---:|
| 0 | 3,500 | 2,249 | 900 |
| 1 | 3,359 | 2,115 | 900 |
| 2 | 3,222 | 1,986 | 900 |
| 3 | 3,091 | 1,863 | 900 |
| 5 | 2,842 | 1,630 | 900 |
| 10 | 2,293 | 1,129 | 900 |
| 15 | 1,833 | 725 | 900 |
| 20 | 1,443 | 404 | 900 |
| 25 | 1,109 | 154 | 900 |
| 30 | 819 | 0 | 840 |
| 35 | 594 | 0 | 589 |
| 40 | 437 | 0 | 406 |
| 45 | 329 | 0 | 271 |
| 50 | 260 | 0 | 167 |


**Winner: attacker** after **50 rounds**. Attacker HP left 7.4%, defender HP left 4.3%.

| Group | Started | Survived | Lost | Lost % | Damage dealt (HP) |
|---|---:|---:|---:|---:|---:|
| A1 Infantry T10 (player) | 3,500 | 260 | 3,240 | 92.6% | 3,359,050 |
| D1 Infantry T10 (camp) | 2,249 | 0 | 2,249 | 100.0% | 1,228,684 |
| D2 Archers T10 (camp) | 900 | 167 | 733 | 81.4% | 2,660,221 |


Loot (not part of the fight): `camp loot × (0.5 + 0.5 × the winner's HP share left) × loot research`: here the winner keeps 7.4% of its HP, so 53.7% of the camp's loot.

## 7b. Scenario 6: a rally of three players, and how the kills are split

Rally force: Leader 400 T5 infantry, Guildmate 1 250 T5 cavalry, Guildmate 2 350 T5 archers, fighting as one army (the leader's attack research applies to everyone; none here). Defender: the owner's 500 infantry, 400 archers, 60 siege.

| Group | Troops | ATK | DEF | HP each | Total HP pool | Damage taken per 100 raw (DEF mitigation) |
|---|---:|---:|---:|---:|---:|---:|
| A1 Infantry T5 (Leader) | 400 | 51 | 42 | 334 | 133,600 | 70.4 |
| A2 Cavalry T5 (Guildmate 1) | 250 | 139 | 29 | 306 | 76,500 | 77.5 |
| A3 Archers T5 (Guildmate 2) | 350 | 87 | 18 | 250 | 87,500 | 84.7 |
| D1 Infantry T5 (Owner) | 500 | 51 | 42 | 334 | 167,000 | 70.4 |
| D2 Archers T5 (Owner) | 400 | 87 | 18 | 250 | 100,000 | 84.7 |
| D3 Siege T5 (Owner) | 60 | 367 | 17 | 223 | 13,380 | 85.5 |

Troops alive after each round:

| Round | A1 | A2 | A3 | D1 | D2 | D3 |
|---:|---:|---:|---:|---:|---:|---:|
| 0 | 400 | 250 | 350 | 500 | 400 | 60 |
| 1 | 226 | 234 | 350 | 348 | 371 | 31 |
| 2 | 98 | 223 | 350 | 217 | 343 | 2 |
| 3 | 15 | 216 | 350 | 103 | 317 | 0 |
| 4 | 0 | 213 | 350 | 0 | 292 | 0 |
| 6 | 0 | 135 | 350 | 0 | 0 | 0 |


**Winner: attacker** after **6 rounds**. Attacker HP left 43.2%, defender HP left 0.0%.

| Group | Started | Survived | Lost | Lost % | Damage dealt (HP) |
|---|---:|---:|---:|---:|---:|
| A1 Infantry T5 (Leader) | 400 | 0 | 400 | 100.0% | 26,542 |
| A2 Cavalry T5 (Guildmate 1) | 250 | 135 | 115 | 46.0% | 150,833 |
| A3 Archers T5 (Guildmate 2) | 350 | 350 | 0 | 0.0% | 127,744 |
| D1 Infantry T5 (Owner) | 500 | 0 | 500 | 100.0% | 45,104 |
| D2 Archers T5 (Owner) | 400 | 0 | 400 | 100.0% | 96,897 |
| D3 Siege T5 (Owner) | 60 | 0 | 60 | 100.0% | 30,045 |


**Kill split (by damage dealt).** Everything the defending side lost (960 troops, dead + wounded) is shared out in proportion to the HP damage each participant's troops dealt:

| Participant | Damage dealt | Share | Kills |
|---|---:|---:|---:|
| Leader | 26,542 | 8.7% | 83 |
| Guildmate 1 | 150,833 | 49.4% | 474 |
| Guildmate 2 | 127,744 | 41.9% | 401 |

(The last participant takes the rounding remainder so the kills add up exactly. The defender's kills are everything the attacking force lost: 515.)
Each participant's own losses are theirs: 20% wounded into their own Hospital, the rest dead, survivors home.

## 8. Scenario 7: what the ±5% roll does

The game draws one roll per side per battle, uniform between 0.95 and 1.05 (experimental, may change). It multiplies all that side's damage in every round. Mirror fight, 1,000 vs 1,000 Tier-5 infantry:

| Attacker roll | Defender roll | Winner | Rounds | Winner's troops left |
|---:|---:|---|---:|---:|
| 0.95 | 1.05 | defender | 18 | 279 |
| 1.00 | 1.00 | defender | 50 | 3 |
| 1.05 | 0.95 | attacker | 18 | 279 |
| 1.05 | 1.05 | defender | 50 | 3 |
| 0.95 | 0.95 | defender | 50 | 4 |
| 1.00 | 1.05 | defender | 20 | 193 |
| 1.05 | 1.00 | attacker | 20 | 193 |

Two equal armies: whoever rolls higher wins, and an even roll goes to the **defender** (a mutual wipe in the same round is decided by HP% left, ties to the defender). With a 10% larger attacker (1,100 vs 1,000):

| Attacker roll | Defender roll | Winner | Rounds | Winner's troops left |
|---:|---:|---|---:|---:|
| 0.95 | 1.05 | attacker | 18 | 292 |
| 1.00 | 1.00 | attacker | 15 | 422 |
| 1.05 | 0.95 | attacker | 13 | 515 |

So the roll decides even fights (including the round-50 cap, see section 3b) but not a fight with a clear lead: a 10% bigger attacker wins even with the worst roll combination (0.95 vs 1.05), keeping 292 of 1,100 troops instead of 422 with equal rolls. The roll also decides which side wins an *exactly* even fight, where the defender otherwise wins every tie.
