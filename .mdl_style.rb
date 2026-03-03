# mdl style file — aligns rule set with .markdownlint.json
# mdl uses Ruby DSL style files; .markdownlint.json is read by markdownlint-cli, not mdl.
# This file ensures both tools agree on which rules are active.
all
exclude_rule 'MD001'
exclude_rule 'MD002'
# MD007: markdownlint.json configures indent:4 (allows 4-space nested lists); mdl only supports 2-space default
exclude_rule 'MD007'
exclude_rule 'MD012'
exclude_rule 'MD013'
exclude_rule 'MD022'
exclude_rule 'MD024'
exclude_rule 'MD029'
exclude_rule 'MD031'
exclude_rule 'MD032'
exclude_rule 'MD033'
exclude_rule 'MD036'
exclude_rule 'MD040'
exclude_rule 'MD041'
exclude_rule 'MD060'
