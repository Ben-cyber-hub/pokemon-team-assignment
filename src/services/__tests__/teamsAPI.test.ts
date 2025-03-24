import { teamsAPI } from '../teamsAPI'

describe('teamsAPI', () => {
  it('exports the expected methods', () => {
    expect(teamsAPI).toBeDefined()
    expect(typeof teamsAPI.getTeam).toBe('function')
  })
})