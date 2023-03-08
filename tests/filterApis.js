import { test } from 'uvu';
import * as assert from 'uvu/assert';

import {filenamesToSet} from '../filterApis.js';

const FULL_LIST = "../adyen-postman/postman/BalanceControlService-v1.json ../adyen-postman/postman/BalancePlatformService-v1.json ../adyen-postman/postman/BalancePlatformService-v2.json ../adyen-postman/postman/BinLookupService-v40.json ../adyen-postman/postman/BinLookupService-v50.json ../adyen-postman/postman/BinLookupService-v52.json ../adyen-postman/postman/BinLookupService-v53.json ../adyen-postman/postman/BinLookupService-v54.json ../adyen-postman/postman/CheckoutService-v37.json ../adyen-postman/postman/CheckoutService-v40.json ../adyen-postman/postman/CheckoutService-v41.json ../adyen-postman/postman/CheckoutService-v46.json ../adyen-postman/postman/CheckoutService-v49.json ../adyen-postman/postman/CheckoutService-v50.json ../adyen-postman/postman/CheckoutService-v51.json ../adyen-postman/postman/CheckoutService-v52.json ../adyen-postman/postman/CheckoutService-v53.json ../adyen-postman/postman/CheckoutService-v64.json ../adyen-postman/postman/CheckoutService-v65.json ../adyen-postman/postman/CheckoutService-v66.json ../adyen-postman/postman/CheckoutService-v67.json ../adyen-postman/postman/CheckoutService-v68.json ../adyen-postman/postman/CheckoutService-v69.json ../adyen-postman/postman/CheckoutService-v70.json ../adyen-postman/postman/DataProtectionService-v1.json ../adyen-postman/postman/LegalEntityService-v1.json ../adyen-postman/postman/LegalEntityService-v2.json ../adyen-postman/postman/LegalEntityService-v3.json ../adyen-postman/postman/ManagementService-v1.json ../adyen-postman/postman/PayoutService-v30.json ../adyen-postman/postman/PayoutService-v40.json ../adyen-postman/postman/PayoutService-v50.json ../adyen-postman/postman/PayoutService-v51.json ../adyen-postman/postman/PayoutService-v52.json ../adyen-postman/postman/PayoutService-v64.json ../adyen-postman/postman/PayoutService-v67.json ../adyen-postman/postman/PayoutService-v68.json ../adyen-postman/postman/RecurringService-v25.json ../adyen-postman/postman/RecurringService-v30.json ../adyen-postman/postman/RecurringService-v40.json ../adyen-postman/postman/RecurringService-v49.json ../adyen-postman/postman/RecurringService-v67.json ../adyen-postman/postman/RecurringService-v68.json ../adyen-postman/postman/StoredValueService-v46.json ../adyen-postman/postman/TestCardService-v1.json ../adyen-postman/postman/TfmAPIService-v1.json ../adyen-postman/postman/TransferService-v1.json ../adyen-postman/postman/TransferService-v2.json ../adyen-postman/postman/TransferService-v3.json"
const FULL_FILENAMES = FULL_LIST.split(" ");

const CLEAN_LIST = "../adyen-postman/postman/BalanceControlService-v1.json ../adyen-postman/postman/BalancePlatformService-v2.json ../adyen-postman/postman/BinLookupService-v54.json ../adyen-postman/postman/CheckoutService-v70.json ../adyen-postman/postman/DataProtectionService-v1.json ../adyen-postman/postman/LegalEntityService-v3.json ../adyen-postman/postman/ManagementService-v1.json ../adyen-postman/postman/PayoutService-v68.json ../adyen-postman/postman/RecurringService-v68.json ../adyen-postman/postman/StoredValueService-v46.json ../adyen-postman/postman/TestCardService-v1.json ../adyen-postman/postman/TfmAPIService-v1.json ../adyen-postman/postman/TransferService-v3.json"
const CLEAN_FILENAMES = CLEAN_LIST.split(" ");

test('filenamesToSet empty', () => {
    assert.equal(filenamesToSet([]), []);
});

test('filenamesToSet no reduction', () => {
    assert.equal(filenamesToSet(
        ["../adyen-postman/postman/BalanceControlService-v1.json", "../adyen-postman/postman/BinLookupService-v40.json"]
    ),
        ["../adyen-postman/postman/BalanceControlService-v1.json", "../adyen-postman/postman/BinLookupService-v40.json"]);
});

test('filenamesToSet simple, reduction', () => {
    assert.equal(filenamesToSet(
            ["../adyen-postman/postman/BinLookupService-v39.json", "../adyen-postman/postman/BinLookupService-v40.json", "../adyen-postman/postman/BinLookupService-v42.json"]
        ),
        ["../adyen-postman/postman/BinLookupService-v42.json"]);
});

test('filenamesToSet full', () => {
    assert.equal(filenamesToSet(FULL_FILENAMES), CLEAN_FILENAMES);
});

test.run();


