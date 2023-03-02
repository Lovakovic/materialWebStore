import {Directive, HostListener} from '@angular/core';
import {NgControl} from "@angular/forms";

@Directive({
  selector: '[trim]'
})
export class TrimDirective {

  constructor(private control: NgControl) { }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: string) {
    const trimmed = value.trim();
    this.control.control?.setValue(trimmed);
  }
}
