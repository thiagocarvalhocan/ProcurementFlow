import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconSearchNormalComponent } from "../../../components/icons/icon-search-normal/icon-search-normal.component";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule,IconSearchNormalComponent, AutoCompleteModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent {
  @Input() placeholder: string = 'Search...';
  @Input() model: string = '';
  @Input() fullWidth = false;
  @Input() options: string[] = [];
  @Input() isAutoComplete: boolean = false;

  @Output() modelChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  filteredOptions: string[] = [];
  private input$ = new Subject<string>();

  ngOnInit() {
    this.input$
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        const isEmpty = !value || value.trim().length === 0;
        const hasMinLength = value.length >= 3;

        if (isEmpty || hasMinLength) {
          this.search.emit();
        }
      });
  }

  filter(event: any) {
      const query = (event.query || '').toLowerCase();

      this.filteredOptions = this.options.filter(option =>
        option.toLowerCase().includes(query)
      );
    }

  onSelect() {
    this.search.emit();
  }

  onSearch() {
    this.search.emit();
  }

  onBlur() {
    this.blur.emit();
  }

  onModelChange(value: string) {
    this.modelChange.emit(value);
      
    if(this.isAutoComplete) {
      this.model = value;
      this.input$.next(value);
    }
  }
}
