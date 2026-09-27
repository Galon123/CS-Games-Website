import os
import re

with open('components/ChessView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

womens_standings = """const WOMENS_STANDINGS = [
  { pos: 1, name: 'C jayanthi', pts: 3 },
  { pos: 2, name: 'Anagha', pts: 2 },
  { pos: 3, name: 'Anna Caroline', pts: 1 },
  { pos: 4, name: 'Lakshmi U', pts: 0 },
]"""

womens_rounds = """const WOMENS_ROUNDS = [
  {
    round: 1,
    matches: [
      { id: '1-1', p1: 'C jayanthi', p1c: 'White', s1: 1, p2: 'Anna Caroline', p2c: 'Black', s2: 0 },
      { id: '1-2', p1: 'Anagha', p1c: 'White', s1: 1, p2: 'Lakshmi U', p2c: 'Black', s2: 0 },
    ]
  },
  {
    round: 2,
    matches: [
      { id: '2-1', p1: 'Anagha', p1c: 'White', s1: 0, p2: 'C jayanthi', p2c: 'Black', s2: 1 },
      { id: '2-2', p1: 'Lakshmi U', p1c: 'White', s1: 0, p2: 'Anna Caroline', p2c: 'Black', s2: 1 },
    ]
  },
  {
    round: 3,
    matches: [
      { id: '3-1', p1: 'C jayanthi', p1c: 'White', s1: 1, p2: 'Lakshmi U', p2c: 'Black', s2: 0 },
      { id: '3-2', p1: 'Anna Caroline', p1c: 'White', s1: 0, p2: 'Anagha', p2c: 'Black', s2: 1 },
    ]
  }
]"""

content = content.replace('const WOMENS_STANDINGS: any[] = []', womens_standings)
content = content.replace('const WOMENS_ROUNDS: any[] = []', womens_rounds)

with open('components/ChessView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
