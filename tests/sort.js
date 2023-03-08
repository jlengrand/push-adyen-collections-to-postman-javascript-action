import { test } from 'uvu';
import * as assert from 'uvu/assert';

import {list} from '../sort.js';
test('sort.list', () => {
    assert.equal(list(), []);
});


test.run();