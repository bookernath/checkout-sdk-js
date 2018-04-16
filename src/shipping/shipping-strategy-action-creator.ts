import { createAction, createErrorAction, ThunkAction } from '@bigcommerce/data-store';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Address } from '../address';
import { Registry } from '../common/registry';

import {
    ShippingStrategyActionType,
    ShippingStrategyDeinitializeAction,
    ShippingStrategyInitializeAction,
    ShippingStrategySelectOptionAction,
    ShippingStrategyUpdateAddressAction,
} from './shipping-strategy-actions';
import { ShippingStrategy } from './strategies';

export default class ShippingStrategyActionCreator {
    constructor(
        private _strategyRegistry: Registry<ShippingStrategy>
    ) {}

    updateAddress(address: Address, options: ShippingActionOptions = {}): ThunkAction<ShippingStrategyUpdateAddressAction> {
        return store => Observable.create((observer: Observer<ShippingStrategyUpdateAddressAction>) => {
            const { remote = {} } = store.getState().checkout.getCustomer() || {};
            const methodId = options.methodId || remote.provider;

            observer.next(createAction(ShippingStrategyActionType.UpdateAddressRequested, undefined, { methodId }));

            this._strategyRegistry.get(methodId)
                .updateAddress(address, { ...options, methodId })
                .then(() => {
                    observer.next(createAction(ShippingStrategyActionType.UpdateAddressSucceeded, undefined, { methodId }));
                    observer.complete();
                })
                .catch(error => {
                    observer.error(createErrorAction(ShippingStrategyActionType.UpdateAddressFailed, error, { methodId }));
                });
        });
    }

    selectOption(addressId: string, shippingOptionId: string, options: ShippingActionOptions = {}): ThunkAction<ShippingStrategySelectOptionAction> {
        return store => Observable.create((observer: Observer<ShippingStrategySelectOptionAction>) => {
            const { remote = {} } = store.getState().checkout.getCustomer() || {};
            const methodId = options.methodId || remote.provider;

            observer.next(createAction(ShippingStrategyActionType.SelectOptionRequested, undefined, { methodId }));

            this._strategyRegistry.get(methodId)
                .selectOption(addressId, shippingOptionId, { ...options, methodId })
                .then(() => {
                    observer.next(createAction(ShippingStrategyActionType.SelectOptionSucceeded, undefined, { methodId }));
                    observer.complete();
                })
                .catch(error => {
                    observer.error(createErrorAction(ShippingStrategyActionType.SelectOptionFailed, error, { methodId }));
                });
        });
    }

    initialize(options: ShippingActionOptions = {}): ThunkAction<ShippingStrategyInitializeAction> {
        return store => Observable.create((observer: Observer<ShippingStrategyInitializeAction>) => {
            const { remote = {} } = store.getState().checkout.getCustomer() || {};
            const methodId = options.methodId || remote.provider;

            observer.next(createAction(ShippingStrategyActionType.InitializeRequested, undefined, { methodId }));

            this._strategyRegistry.get(methodId)
                .initialize({ ...options, methodId })
                .then(() => {
                    observer.next(createAction(ShippingStrategyActionType.InitializeSucceeded, undefined, { methodId }));
                    observer.complete();
                })
                .catch(error => {
                    observer.error(createErrorAction(ShippingStrategyActionType.InitializeFailed, error, { methodId }));
                });
        });
    }

    deinitialize(options: ShippingActionOptions = {}): ThunkAction<ShippingStrategyDeinitializeAction> {
        return store => Observable.create((observer: Observer<ShippingStrategyDeinitializeAction>) => {
            const { remote = {} } = store.getState().checkout.getCustomer() || {};
            const methodId = options.methodId || remote.provider;

            observer.next(createAction(ShippingStrategyActionType.DeinitializeRequested, undefined, { methodId }));

            this._strategyRegistry.get(methodId)
                .deinitialize({ ...options, methodId })
                .then(() => {
                    observer.next(createAction(ShippingStrategyActionType.DeinitializeSucceeded, undefined, { methodId }));
                    observer.complete();
                })
                .catch(error => {
                    observer.error(createErrorAction(ShippingStrategyActionType.DeinitializeFailed, error, { methodId }));
                });
        });
    }
}

export interface ShippingActionOptions {
    methodId?: string;
}
