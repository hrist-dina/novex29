import $ from "jquery";
import {Menu} from "./Menu";


export class ScrollToPage {
    constructor(options) {
        this.pages = options.pages;
        this.inScroll = false;
        this.pageScrollOwner = $('.js-page-scroll-owner');
    }

    init() {
        this.events();
    }

    //EVENTS

    events() {
        this.bindScrollPage();
        this.bindScrollBan();
        this.bindPositionTracking();
    }

    bindScrollPage() {
        const self = this;
        this.pageScrollOwner.on('wheel', function (event) {
            let deltaY = event.originalEvent.deltaY,
                activePage = self.pages.filter('.is-show'),
                nextPage = activePage.next(),
                prevPage = activePage.prev(),
                linkToPage = 'main';
            if (deltaY > 0) {
                if (nextPage.length) {
                    self.scroll(nextPage.index());
                    linkToPage = nextPage.attr('id');
                }
            }
            if (deltaY < 0) {
                if (prevPage.length) {
                    self.scroll(prevPage.index());
                    linkToPage = prevPage.attr('id');
                }
            }
            let link = $('.js-menu').find('.js-scroll-link').filter(`[href="#${linkToPage}"]`);
            Menu.prototype.setActiveLink(link);
        });
    }

    bindScrollBan() {
        this.pageScrollOwner.on('wheel', function (event) {
            if (event.preventDefault) event.preventDefault();
            event.returnValue = false;
            return false;
        });
    }

    bindPositionTracking() {
        const self = this;

        $('.js-winners2').on('wheel', function (event) {
            if ($(this).closest('.js-page').hasClass('is-show')) {
                setTimeout(function () {
                    event.stopPropagation();
                },2000);
            }

            if ($(this).height() > $(window).height()) {
                $('.main-wrapper').css('overflow-y', 'scroll');
            }

            let position = $(this).offset().top;
            let deltaY = event.originalEvent.deltaY;

            if (deltaY < 0 && position === 0) {
                self.inScroll = true;

                let pageWinners = $(this).closest('.js-page');
                pageWinners.removeClass('is-show').addClass('is-hide');
                pageWinners.prev().removeClass('is-hide').addClass('is-show');
                setTimeout(function () {
                    self.inScroll = false;
                }, 1000);
            }
        });
    }

    //METHODS

    scroll(pageEq) {
        const self = this;

        if (!self.inScroll) {
            self.inScroll = true;

            if (pageEq === 0) {
                this.pages.removeClass(['is-show', 'is-hide']);
            }

            this.pages.eq(pageEq).addClass('is-show').siblings().removeClass('is-show');
            $('.is-show').removeClass('is-hide').prev().addClass('is-hide');

            $('.js-menu__item').eq(pageEq).addClass('active').siblings().removeClass('active');

            setTimeout(function () {
                self.inScroll = false;
            }, 1000);
        }
    }
}