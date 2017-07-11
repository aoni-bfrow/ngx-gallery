import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, HostListener } from '@angular/core';

import { NgxGalleryHelperService } from './ngx-gallery-helper.service';

@Component({
    selector: 'ngx-gallery-preview',
    templateUrl: './ngx-gallery-preview.component.html',
    styleUrls: ['./ngx-gallery-preview.component.scss']
})
export class NgxGalleryPreviewComponent implements OnChanges {

    src: string;
    description: string;
    showSpinner: boolean = false;

    @Input() images: string[];
    @Input() descriptions: string[];
    @Input() showDescription: boolean;
    @Input() swipe: boolean;
    @Input() fullscreen: boolean;
    @Input() closeOnClick: boolean;
    @Input() keyboardNavigation: boolean;

    @Output() onClose = new EventEmitter();

    private index: number = 0;
    private loadedList: string[] = [];
    private isOpen: boolean = false;

    constructor(private elementRef: ElementRef, private helperService: NgxGalleryHelperService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef,
            'preview', () => this.showNext(), () => this.showPrev());
        }
    }

    @HostListener('window:keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
        if (this.isOpen && this.keyboardNavigation) {
            if (this.isKeyboardPrev(e)) {
                this.showPrev();
            } else if (this.isKeyboardNext(e)) {
                this.showNext();
            }
        }
    }

    open(index: number): void {
        this.index = index;
        this.isOpen = true;
        this.show();
    }

    close(): void {
        this.isOpen = false;
        this.closeFullscreen();
        this.onClose.emit();
    }

    loaded(): void {
        this.showSpinner = false;
        this.loadedList.push(this.src);
    }

    showNext(): void {
        if (this.canShowNext()) {
            this.index++;
            this.show();
        }
    }

    showPrev(): void {
        if (this.canShowPrev()) {
            this.index--;
            this.show();
        }
    }

    canShowNext(): boolean {
        if (this.images) {
            return this.index < this.images.length - 1 ? true : false;
        } else {
            return false;
        }
    }

    canShowPrev(): boolean {
        if (this.images) {
            return this.index > 0 ? true : false;
        } else {
            return false;
        }
    }

    manageFullscreen(): void {
        if (this.fullscreen) {
            const doc = <any>document;

            if (!doc.fullscreenElement && !doc.mozFullScreenElement
                && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                this.openFullscreen();
            } else {
                this.closeFullscreen();
            }
        }
    }

    private isKeyboardNext(e: KeyboardEvent): boolean {
        if (e.keyCode === 39) {
            return true;
        } else {
            return false;
        }
    }

    private isKeyboardPrev(e: KeyboardEvent): boolean {
        if (e.keyCode === 37) {
            return true;
        } else {
            return false;
        }
    }

    private openFullscreen(): void {

        const doc = <any>document;
        const element = <any>document.documentElement;

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
    }

    private closeFullscreen(): void {

        const doc = <any>document;

        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        } else if (doc.msExitFullscreen) {
            doc.msExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
        } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
        }
    }

    private show() {
        this.src = this.images[this.index];
        this.description = this.descriptions[this.index];

        if (this.loadedList.indexOf(this.src) === -1) {
            this.showSpinner = true;
        }
    }
}
