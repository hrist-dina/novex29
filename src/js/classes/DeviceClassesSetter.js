import $ from "jquery";
import detect from "detect.js";

export class DeviceClassesSetter {
    constructor(options) {

    }

    init() {
        this.userAgent = detect.parse(navigator.userAgent);
        $('body')
            .addClass( this.userAgent.device.type.toLowerCase() )
            .addClass( this.userAgent.os.family.toLowerCase() );
    }


}