import {
  animate,
  AnimationBuilder,
  AnimationMetadata,
  AnimationPlayer,
  style
} from '@angular/animations';

import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  share,
  throttleTime,
  takeUntil
} from 'rxjs/operators';

enum Direction {
  Up = 'Up',
  Down = 'Down'
}

/** @dynamic */
@Directive({
  selector: '[appStickyButton]'
})
export class StickyButtonDirective implements AfterViewInit, OnDestroy {
  player: AnimationPlayer;
  destroy$: Subject<boolean> = new Subject<boolean>();

  set show(show: boolean) {
    if (this.player) {
      this.player.destroy();
    }

    const metadata = show ? this.fadeIn() : this.fadeOut();

    const factory = this.builder.build(metadata);
    const player = factory.create(this.el.nativeElement);
    player.play();
  }

  constructor(private builder: AnimationBuilder, private el: ElementRef) {}

  private fadeIn(): AnimationMetadata[] {
    return [
      style({ opacity: 0 }),
      animate(
        '200ms ease-in',
        style({ opacity: 1, transform: 'translateY(0)' })
      )
    ];
  }

  private fadeOut(): AnimationMetadata[] {
    return [
      style({ opacity: '*' }),
      animate(
        '200ms ease-in',
        style({ opacity: 0, transform: 'translateY(+100%)' })
      )
    ];
  }


  ngAfterViewInit() {
    const scroll$ = fromEvent(window, 'scroll').pipe(
      throttleTime(10),
      map(() => window.pageYOffset),
      pairwise(),
      map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
      distinctUntilChanged(),
      share(),
      takeUntil(this.destroy$)
    );

    const goingUp$ = scroll$.pipe(
      filter(direction => direction === Direction.Up)
    );

    const goingDown$ = scroll$.pipe(
      filter(direction => direction === Direction.Down)
    );

    goingUp$.subscribe(() => (this.show = true));
    goingDown$.subscribe(() => (this.show = false));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
