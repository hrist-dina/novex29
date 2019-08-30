import $ from "jquery";

export class Winners {
    constructor(winnersTab = '.js-winners-tab') {
        this.winnersTab = winnersTab;
    }

    init() {
        this.onClick();
    }

    onClick() {
        const self = this;
        $(this.winnersTab).on('click', function () {
            $(self.winnersTab).removeClass('active');
            if (!$(this).hasClass('active')) {
                $(this).addClass('active');
            }
        });
    }
}
