const assert = require('assert');
const Eventable = require('../../../src/scripts/modules/Eventable');
const extendConstructor = require('../../../src/scripts/utils/extendConstructor');

/**
 * @constructor
 * @extends {Eventable}
 */
function EventableStub() {
    this._initEventable();
}

extendConstructor(EventableStub, Eventable);

describe('Eventable', () => {

    describe('.on()', () => {

        it('single listener', () => {
            const eventableStubInstance = new EventableStub();
            let counter = 0;

            eventableStubInstance.on('test', function () {
                counter += 1;
            });
            eventableStubInstance.trigger('test');

            assert.strictEqual(counter, 1);
        });

        it('correct event argument', () => {
            const eventableStubInstance = new EventableStub();
            let triggerArgument = {};
            let listenerArgument;

            eventableStubInstance.on('test', function (arg) {
                listenerArgument = arg;
            });
            eventableStubInstance.trigger('test', triggerArgument);

            assert.strictEqual(listenerArgument, triggerArgument);
        });

        it('correct context', () => {
            const eventableStubInstance = new EventableStub();
            let context = {};
            let contextOfListenerCalling;

            eventableStubInstance.on(
                'test',
                function (arg) {
                    contextOfListenerCalling = context;
                },
                context
            );
            eventableStubInstance.trigger('test');

            assert.strictEqual(contextOfListenerCalling, context);
        });

    });

    describe('.off()', () => {

    });

    describe('.trigger()', () => {

    });
});