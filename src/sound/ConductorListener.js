/**
 * An interface to describe how objects can listen to changes in the conductor.
 */
export default class ConductorListener {
    onConductorChange(changeType, newValue, conductor){}
}