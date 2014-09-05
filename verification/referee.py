"""
CheckiOReferee is a base referee for checking you code.
    arguments:
        tests -- the dict contains tests in the specific structure.
            You can find an example in tests.py.
        cover_code -- is a wrapper for the user function and additional operations before give data
            in the user function. You can use some predefined codes from checkio.referee.cover_codes
        checker -- is replacement for the default checking of an user function result. If given, then
            instead simple "==" will be using the checker function which return tuple with result
            (false or true) and some additional info (some message).
            You can use some predefined codes from checkio.referee.checkers
        add_allowed_modules -- additional module which will be allowed for your task.
        add_close_builtins -- some closed builtin words, as example, if you want, you can close "eval"
        remove_allowed_modules -- close standard library modules, as example "math"

checkio.referee.checkers
    checkers.float_comparison -- Checking function fabric for check result with float numbers.
        Syntax: checkers.float_comparison(digits) -- where "digits" is a quantity of significant
            digits after coma.

checkio.referee.cover_codes
    cover_codes.unwrap_args -- Your "input" from test can be given as a list. if you want unwrap this
        before user function calling, then using this function. For example: if your test's input
        is [2, 2] and you use this cover_code, then user function will be called as checkio(2, 2)
    cover_codes.unwrap_kwargs -- the same as unwrap_kwargs, but unwrap dict.

"""
import string

from checkio.signals import ON_CONNECT
from checkio import api
from checkio.referees.io import CheckiOReferee
from checkio.referees import cover_codes
from checkio.referees import checkers

from tests import TESTS
from tests import WORDS


cover = """def cover(f, data):
    return f(tuple(data[0]), tuple(data[1]))
"""

ERROR_TYPE = (False, "The result must be a list/tuple of strings")
ERROR_SIZE = (False, "The result must have the same size as input data")
ERROR_TEMPLATE = (False, "Your result is not look like the original crossword")
ERROR_UNFILLED = (False, "I see the empty cell in your result")
ERROR_TYPE_CELL = (False, "Cells should contains lowercase ascii letters or 'X'")
F_ERROR_REPEATED = lambda w: (False, "Found repeated words '{}'".format(w))
F_ERROR_UNKNOWN = lambda w: (False, "The word '{}' is not from the dictionary".format(w))

def find_word(grid, row, col):
    word = ""
    while col < len(grid[row]) and grid[row][col] != "X":
        word += grid[row][col]
        col += 1
    return word


def checker(template, result):
    # types check
    if not isinstance(result, (tuple, list)):
        return ERROR_TYPE
    if not all(isinstance(row, str) for row in result):
        return ERROR_TYPE

    # size check
    if (len(result) != len(template) or
            any(len(result[i]) != len(template[i]) for i in range(len(template)))):
        return ERROR_SIZE

    # template, letters and filled check
    for i, row in enumerate(result):
        for j, ch in enumerate(row):
            if ch == "X":
                if template[i][j] != "X":
                    return ERROR_TEMPLATE
            elif ch == ".":
                return ERROR_UNFILLED
            elif ch in string.ascii_lowercase:
                if template[i][j] != ".":
                    return ERROR_TEMPLATE
            else:
                return ERROR_TYPE_CELL

    # words checking
    used_words = set()
    rotated_result = ["".join(row) for row in zip(*result)]

    words = []
    for k, row in enumerate(template):
        for m, symb in enumerate(row):
            if symb == "X":
                continue
            if (k == 0 or template[k - 1][m] == "X") and (k < len(template) - 1 and template[k + 1][m] == "."):
                words.append(find_word(result, k, m))
            if (k == 0 or template[k][m - 1] == "X") and (m < len(template[k]) - 1 and template[k][m + 1] != " "):
                words.append(find_word(rotated_result, m, k))
    for w in words:
        if w in used_words:
            return F_ERROR_REPEATED(w)
        used_words.add(w)
        if w not in WORDS:
            return F_ERROR_UNKNOWN(w)
    return True, "Great!"

api.add_listener(
    ON_CONNECT,
    CheckiOReferee(
        tests=TESTS,
        cover_code={
            'python-27': cover,
            'python-3': cover
        },
        checker=checker,  # checkers.float.comparison(2)
        function_name="solver"
        # add_allowed_modules=[],
        # add_close_builtins=[],
        # remove_allowed_modules=[]
    ).on_ready)
