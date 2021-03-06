import { SharedEventEmitter, ModuleBase } from 'expo-firebase-app';
import Invitation from './Invitation';
export const MODULE_NAME = 'ExpoFirebaseInvites';
export const NAMESPACE = 'invites';
const NATIVE_EVENTS = {
    invitesInvitationReceived: 'Expo.Firebase.invites_invitation_received',
};
export const statics = {
    Invitation,
};
export default class Invites extends ModuleBase {
    constructor(app) {
        super(app, {
            events: Object.values(NATIVE_EVENTS),
            hasCustomUrlSupport: false,
            moduleName: MODULE_NAME,
            hasMultiAppSupport: false,
            namespace: NAMESPACE,
        });
        SharedEventEmitter.addListener(
        // sub to internal native event - this fans out to
        // public event name: onMessage
        NATIVE_EVENTS.invitesInvitationReceived, (invitation) => {
            SharedEventEmitter.emit('onInvitation', invitation);
        });
        // Tell the native module that we're ready to receive events
        if (this.nativeModule.jsInitialised) {
            this.nativeModule.jsInitialised();
        }
    }
    /**
     * Returns the invitation that triggered application open
     * @returns {Promise.<InvitationOpen>}
     */
    async getInitialInvitation() {
        return await this.nativeModule.getInitialInvitation();
    }
    /**
     * Subscribe to invites
     * @param listener
     * @returns {Function}
     */
    onInvitation(listener) {
        this.logger.info('Creating onInvitation listener');
        SharedEventEmitter.addListener('onInvitation', listener);
        return () => {
            this.logger.info('Removing onInvitation listener');
            SharedEventEmitter.removeListener('onInvitation', listener);
        };
    }
    async sendInvitation(invitation) {
        if (!(invitation instanceof Invitation)) {
            throw new Error(`Invites:sendInvitation expects an 'Invitation' but got type ${typeof invitation}`);
        }
        return await this.nativeModule.sendInvitation(invitation.build());
    }
}
Invites.moduleName = MODULE_NAME;
Invites.namespace = NAMESPACE;
Invites.statics = statics;
export { default as Invitation } from './Invitation';
//# sourceMappingURL=index.js.map