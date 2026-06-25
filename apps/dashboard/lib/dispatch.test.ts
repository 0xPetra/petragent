import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { sanitizeModel, sanitizeSkillVar } from './dispatch'

describe('dispatch sanitizers', () => {
  it('keeps flag-style skill vars used by tech-tree', () => {
    assert.equal(
      sanitizeSkillVar('AI agents --depth=deep --nodes=12'),
      'AI agents --depth=deep --nodes=12',
    )
  })

  it('keeps non-shell separators used by on-demand skills', () => {
    assert.equal(
      sanitizeSkillVar('wallet:spender:token, owner/repo #tag @user'),
      'wallet:spender:token, owner/repo #tag @user',
    )
  })

  it('strips shell metacharacters from skill vars', () => {
    assert.equal(sanitizeSkillVar('AI agents; rm -rf $HOME | cat'), 'AI agents rm -rf HOME cat')
  })

  it('keeps model identifiers narrow', () => {
    assert.equal(sanitizeModel('claude-opus-4-8;bad'), 'claude-opus-4-8bad')
  })
})
