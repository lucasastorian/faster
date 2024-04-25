import { animate, style, transition, trigger } from "@angular/animations";

export const FadeInAnimation = trigger(
    "fadeIn",
    [
      transition(
        ":enter",
        [
          style({ opacity: 0 }),
          animate("150ms ease-out", style({ opacity: 1 }))
        ]
      ),
    ]
  )