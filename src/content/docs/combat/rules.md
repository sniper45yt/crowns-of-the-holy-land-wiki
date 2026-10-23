---
title: Combat rules
description: How a battle is resolved - rounds, damage, targeting, counters and the random roll.
sidebar:
  order: 1
---

Every fight in the game uses the same rules: attacking another player, a rally, and raiding an NPC camp. Battles are resolved instantly on the server, so nothing about the result depends on your device or connection.

## Armies and groups

An army is a list of **groups**. One group is one troop type at one tier belonging to one player. When several players fight on the same side (a rally, or a castle with stationed reinforcements), their groups fight as **one army**, and the report afterwards shows who lost what.

## The four troop types

| Type | Role |
| --- | --- |
| Infantry | The meat shield: lowest attack, highest defence and health. |
| Cavalry | Strong attack, weak defence. |
| Archers | In between. |
| Siege | The glass cannon: about six times an infantry troop's damage, but the lowest defence and health. |

See [Troops and stats](../troops/) for the full table.

## How a battle works

1. Each troop has **HP** (health), **ATK** (attack) and **DEF** (defence). A group's **pool** is its troop count times HP.
2. Each side gets **one random roll** between 0.95 and 1.05. It multiplies all of that side's damage for the whole battle.
3. The battle runs in **rounds** until one side has no troops left. In each round all groups act at the same time, using the troops that were alive at the start of the round. A group that dies this round still deals its damage this round.
4. A group's raw damage is **troops alive × ATK × its side's roll**.

## Who gets hit

The enemy **front line** is the first troop type that still has living troops, in this order: **infantry, cavalry, archers, siege**.

- **80%** of a group's damage goes to the enemy front line.
- **20%** goes to the type this group counters, if that type is still alive. If it is dead, all damage goes to the front line.
- Inside a troop type, damage is shared between that side's groups of that type in proportion to their current health pools, so different tiers and owners share it.

## The counter cycle

**Infantry beat cavalry, cavalry beat archers, archers beat siege, and siege beat infantry.**

Damage that lands on the type the attacker counters is multiplied by **1.25**. This depends on the type that is hit, not on which share it was. If the front line itself is the countered type, both the 80% and the 20% portions get the bonus.

Because only 20% of the damage is aimed at the counter target, the rock-paper-scissors effect is smaller in mixed armies than in single-type fights. Most damage goes to whatever stands at the front.

## Defence

A target takes `damage × 100 / (100 + DEF)`. DEF 42 means it takes about 70% of the damage, and DEF 100 means 50%.

## Overkill is wasted

Damage above what a group has left is lost. It is not passed on to other groups, so a strong group hitting a small front line burns most of its damage on it.

## Who wins

The side that still has troops. If both sides are wiped out in the same round, or the 50-round safety cap is reached, the side with the higher percentage of its starting health left wins. Ties go to the defender.

Fights between large, high-DEF armies are slow: each round removes only a few percent of the health, so equal armies often reach the cap. See the [walkthroughs](../walkthroughs/) for examples.

## What is not in the rules

- There is **no defender bonus** and no special siege rule.
- A small numerical lead snowballs: because damage is proportional to the troops you have left, an army 11% bigger can finish a fight with about 40% of its troops.

:::note
The balance of all these numbers is still being tuned. This page describes how the game works today.
:::
