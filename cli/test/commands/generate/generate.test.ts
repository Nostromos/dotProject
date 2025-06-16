import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('Generate Command', () => {
  it('runs generate cmd', async () => {
    const { stdout } = await runCommand('generate')
    expect(stdout).to.contain('INFO.yml generated at')
  })
})
