"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""

TESTS = {
    "Basics": [
        {
            "input": ['.XXX.', '...X.', '.X.X.', '.....'],
            "answer": ['.XXX.', '...X.', '.X.X.', '.....'],
        },

        {
            "input": ['X.XX', '....', 'X.XX', 'X...', 'XXX.', '....', 'XXX.'],
            "answer": ['X.XX', '....', 'X.XX', 'X...', 'XXX.', '....', 'XXX.'],
        },

        {
            "input": ['...XXXXXX', '.XXX.X...', '.....X.XX', 'XXXX.X...', 'XX...X.XX', 'XX.XXX.X.', 'X......X.',
                      'XX.X.XXX.', 'XXXX.....'],
            "answer": ['...XXXXXX', '.XXX.X...', '.....X.XX', 'XXXX.X...', 'XX...X.XX', 'XX.XXX.X.', 'X......X.',
                       'XX.X.XXX.', 'XXXX.....'],
        }
    ],
    "Extra": [
        {
            "input": ['.XXX.', '...X.', '.X.X.', '.....'],
            "answer": ['.XXX.', '...X.', '.X.X.', '.....'],
        },

        {
            "input": ['X.XX', '....', 'X.XX', 'X...', 'XXX.', '....', 'XXX.'],
            "answer": ['X.XX', '....', 'X.XX', 'X...', 'XXX.', '....', 'XXX.'],
        },

        {
            "input": ['...XXXXXX', '.XXX.X...', '.....X.XX', 'XXXX.X...', 'XX...X.XX', 'XX.XXX.X.', 'X......X.',
                      'XX.X.XXX.', 'XXXX.....'],
            "answer": ['...XXXXXX', '.XXX.X...', '.....X.XX', 'XXXX.X...', 'XX...X.XX', 'XX.XXX.X.', 'X......X.',
                       'XX.X.XXX.', 'XXXX.....'],
        }
    ]
}
