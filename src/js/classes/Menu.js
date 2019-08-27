import $ from "jquery";

export class Menu {
    constructor(options) {
        this.menu = options.menu;
        this.menuBtn = options.menuBtn;
        this.scrollOwner = options.scrollOwner;
    }

    init() {
        this.setActiveLink( this.determineActiveLink.bind( this )() );
        this.events();
    }

    events() {
        this.bindOpenMenu();
        this.bindCloseMenu();
        this.bindActiveLinkDeterminer();
    }

    bindOpenMenu() {
        const self = this;
        this.menuBtn.on('click', function() {
            self.openMenu();
        });
    }

    bindCloseMenu() {
        const self = this;
        this.menu.find('.menu__close').on('click', function() {
            self.closeMenu();
        });
    }

    bindActiveLinkDeterminer() {
        let self = this;
        self.scrollOwner.on('scroll', function() {
            self.setActiveLink( self.determineActiveLink.bind( self )() );
        });
    }

    openMenu() {
        this.menu.removeClass('is-hide').addClass('is-show');
    }

    closeMenu() {
        this.menu.removeClass('is-show').addClass('is-hide');
    }

    determineActiveLink() {
        if ($('body').hasClass('desktop')) {
            const id = $('.js-page').filter('.is-show').attr('id');
            return this.menu.find(`[href="#${id}"]`);
        }
        const self = this;
        let links = self.menu.find('.menu__link');
        let scrollOwnerScrolled = self.scrollOwner.scrollTop();
        let activeLink = null;
        links.each(function() {
            let linkedPage = $( $(this).attr('href') );
            if (!linkedPage.length) {
                return false;
            }
            let linkedPageOffset = scrollOwnerScrolled + linkedPage.offset().top;
            let linkedPageHeight = linkedPage.outerHeight();
            let windowHeight = $(window).height();

            let linkedPageIsOnScreen =
                ( scrollOwnerScrolled + windowHeight > linkedPageOffset + windowHeight / 2) &&
                ( scrollOwnerScrolled < linkedPageOffset - windowHeight / 2 + linkedPageHeight );

            if ( linkedPageIsOnScreen )  {
                activeLink = $(this);
                return false;
            }
        });
        return activeLink;
    }

    setActiveLink(link) {
        if ( link ) link.closest('.menu__item').addClass('active').siblings().removeClass('active');
    }
}