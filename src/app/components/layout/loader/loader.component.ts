import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent {
  @Input() isLoading: boolean = false;
  @Input() bdColor: string = 'rgba(255,255,255,0.8)';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get sizeClass(): string {
    switch (this.size) {
      case 'sm':
        return 'la-sm';
      case 'md':
        return 'la-2x';
      case 'lg':
        return 'la-3x';
      default:
        return 'la-2x';
    }
  }
}
