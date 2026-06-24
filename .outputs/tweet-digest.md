TWEET_DIGEST_NO_CONFIG.

## Summary

- Read `skills/tweet-digest/SKILL.md` and checked for the required config file `memory/topics/tracked-accounts.yml`.
- The config file does not exist (`memory/topics/` contains only `milestone-dispatch.json` and `skill-spotlight.md`).
- Per the skill spec, exited with `TWEET_DIGEST_NO_CONFIG` and sent no notification.
- Appended a log entry to `memory/logs/2026-06-24.md`.

**Follow-up:** To activate this skill, create `memory/topics/tracked-accounts.yml` with the X/Twitter handles to track (see the YAML schema in the SKILL.md).
