import { Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/note.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Note } from 'src/app/models/note.model';
import { List } from 'src/app/models/list.model';

@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.scss']
})
export class NoteViewComponent implements OnInit {

  lists: List[];
  notes: Note[];

  selectedListId: string;

  constructor(private noteService: NoteService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        if (params.listId) {
          this.selectedListId = params.listId;
          this.noteService.getNotes(params.listId).subscribe((notes: Note[]) => {
            this.notes = notes;
          })
        } else {
          this.notes = undefined;
        }
      }
    )

    this.noteService.getLists().subscribe((lists: List[]) => {
      this.lists = lists;
    })

  }

  onNoteClick(note: Note) {
    // we want to set the note to be completed
    this.noteService.complete(note).subscribe(() => {
      // the note has been set to completed successfully
      console.log("Completed successully!");
      note.completed = !note.completed;
    })
  }

  onDeleteListClick() {
    this.noteService.deleteList(this.selectedListId).subscribe((res: any) => {
      this.router.navigate(['/lists']);
      console.log(res);
    })
  }

  onDeleteNoteClick(id: string) {
    this.noteService.deleteNote(this.selectedListId, id).subscribe((res: any) => {
      this.notes = this.notes.filter(val => val._id !== id);
      console.log(res);
    })
  }

}
