class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem('notes')) || [];
 
    this.title = '';
    this.text = '';
    this.id = '';

    this.$header = document.querySelector('header');
    this.$formContainer = document.querySelector('.form-container');
    this.$form = document.querySelector('.form');
    this.$noteTitle = document.querySelector('.note-title');
    this.$noteText = document.querySelector('.note-text');
    this.$formButtons = document.querySelector('.form-buttons');
    this.$placeholder = document.querySelector('.placeholder');
    this.$noteContainer = document.querySelector('.notes');
    this.$closeFormButton = document.querySelector('.close-form-btn');
    this.$editor = document.querySelector('.editor');
    this.$editorTitle = document.querySelector('.editor-title');
    this.$editorText = document.querySelector('.editor-text');
    this.$editorCloseButton = document.querySelector('.editor-close-btn');
    this.$editorContent = document.querySelector('.editor-content');
    this.$colorTooltip = document.querySelector('.color-tooltip');
    this.$colorsOption =document.querySelectorAll('.color-option');

    this.render();
    this.deleteCheckedNotes();
    this.addEventListener();
    
  }
  addEventListener() {
    document.body.addEventListener('click', event => {
      this.handleFormClick(event);
      this.selectNote(event);
      this.openEditor(event);
      this.deleteNote(event);
      this.markNote(event);
      this.checkNote(event);

    });
    
    document.body.addEventListener('mouseover', event=>{
      this.openTooltip(event);
      
    });
    document.body.addEventListener('mouseout', event=>{
      this.closeTooltip(event);
    });
    this.$colorTooltip.addEventListener('mouseover', function(){
      this.style.display = 'flex';
    });
    this.$colorTooltip.addEventListener('mouseout', function(){
      this.style.display = 'none';
    });

    this.$colorsOption.forEach(color_option => {
      color_option.addEventListener('click', event =>{
        const color = event.target.dataset.color;
        if(color){
          this.editNoteColor(color);
        }
    })
    });
   
    this.$form.addEventListener('submit', event => {
      event.preventDefault();
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      const hasNote = title || text;
      if (hasNote) {
        this.addNote({ title, text });
      }
    });
  
    this.$closeFormButton.addEventListener('click', event =>{
        event.stopPropagation();
        this.closeForm();
    });
    this.$editorCloseButton.addEventListener('click', event=>{
      this.closeEditor(event);
    });
    document.body.addEventListener('click',event=>{
      // event.stopPropagation();
      // console.log(event.bubbles);
      if(this.$editor.classList.contains('open-editor')){
        if(event.target.closest('.editor-content')||event.target.closest('.note') ){return};
        this.closeEditor(event);   
      }
    })
 
  }
  handleFormClick(event) {
    const isClicked = this.$form.contains(event.target);
    const title = this.$noteTitle.value;
    const text = this.$noteText.value;
    const hasNote = title || text;

    if (isClicked) {
      this.openForm();
    } else if(hasNote){
      this.addNote({ title, text });
    } 
    else{
      this.closeForm();
    }
  }
  openForm() {
    this.$noteTitle.style.display = 'block';
    this.$formButtons.style.display = 'block';
  }
  closeForm() {
    this.$noteTitle.style.display = 'none';
    this.$formButtons.style.display = 'none';
    this.$noteTitle.value = "";
    this.$noteText.value = "";
  }
  addNote(note) {
    const newNote = {
      title: note.title,
      text: note.text,
      color: 'white',
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
    };
    this.notes = [...this.notes, newNote];
    this.render();
    this.closeForm();
  }
  deleteNote(event){
    event.stopPropagation();
    if(!event.target.matches('.fa-trash-alt')) return;
    const id = event.target.parentNode.dataset.id;
    this.notes= this.notes.filter(note => note.id !== Number(id));
    this.render();
   
  }
  markNote(event){
    if(!event.target.matches('.fa-exclamation')) return;
    const id = event.target.parentNode.dataset.id;
    this.notes = this.notes.map(note =>
      note.id === Number(id) ? { ...note,color:'#f8221b'  } : note 
  );
    this.render();
  }
  checkNote(event){
    if(!event.target.matches('.fa-check')) return;
    const id = event.target.parentNode.dataset.id;
    this.notes = this.notes.map(note =>
      note.id === Number(id) ? { ...note,color:'#83a848'  } : note 
  );
    this.render();
  }

  render(){
    this.displayNotes();
    this.saveNotes();
  }
  saveNotes(){
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }
  deleteCheckedNotes(){
    this.notes =this.notes.filter(note => note.color!== '#83a848');
    this.displayNotes();
  }
  displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style.display = hasNotes ? 'none' : 'block';

    this.$noteContainer.innerHTML = this.notes.map(note =>
      ` <div class="note" style="background: ${note.color};" data-id="${note.id}">
          <p class="note-title">${note.title}</p>
          <p class="note-text">${note.text}</p>
          <div class="toolbar-container">
           <ul class="toolbar" >
             <li class="toolbar-delete"data-id="${note.id}"><i class="fas fa-trash-alt"></i></li>
             <li class="toolbar-palette"data-id="${note.id}"><i class="fas fa-palette" data-id="${note.id}"></i></li>
             <li class="toolbar-exclamation" data-id="${note.id}"><i class="fas fa-exclamation"></i></li>
             <li class="toolbar-check" data-id="${note.id}"><i class="fas fa-check"></i></li>
           </ul>
         </div>
      </div>
        `).join("");
     
  }
  openEditor(event){

    if(event.target.matches('.fa-trash-alt')) return;
    if(event.target.matches('.fa-exclamation')) return;
    if(event.target.matches('.fa-check')) return;
    
    if(event.target.closest(".note")){
     this.$editor.classList.toggle('open-editor');
     this.$editorText.value = this.text;
     this.$editorTitle.value = this.title;
     this.addBlurBackground();
    }
  }
  closeEditor(){
    this.editNote();
    this.$editor.classList.toggle('open-editor');
    this.removeBlurBackground();
  }
  openTooltip(event){
    if(!event.target.matches('.fa-palette')) return;
    this.id = event.target.dataset.id; //event.target.parentNode.dataset.id;
    const noteCoords = event.target.getBoundingClientRect();
    const horizontal = noteCoords.left +3;
    const vertical = noteCoords.top +window.scrollY+ 17;
    this.$colorTooltip.style =`position:absolute; left:${horizontal}px; top:${vertical}px`;
    this.$colorTooltip.style.display = 'flex';

  }
   closeTooltip(event){
    if(!event.target.closest('.toolbar-palette')) return;
    this.$colorTooltip.style.display = 'none';
  }

  addBlurBackground(){

     this.$formContainer.classList.add('blur');
     this.$header.classList.add('blur');
     this.$noteContainer.classList.add('blur');
  }
  removeBlurBackground(){
     this.$formContainer.classList.remove('blur');
     this.$header.classList.remove('blur');
     this.$noteContainer.classList.remove('blur');
  }
 
  selectNote(event){
    const $selectedNote = event.target.closest(".note");
    if(!$selectedNote) return ;
    const [$noteTitle,$noteText] = $selectedNote.children;
    this.title = $noteTitle.innerHTML;
    this.text = $noteText.innerHTML;
    this.id = $selectedNote.dataset.id;
  }
  editNote(){
     const title = this.$editorTitle.value;
     const text = this.$editorText.value;
     this.notes = this.notes.map(note => 
       note.id === Number(this.id) ? { ...note,title,text } : note
     );
     this.render();
  }
  editNoteColor(color){
    this.notes = this.notes.map((note) => 
      note.id === Number(this.id) ? { ...note,color } : note
    );
    this.render();
  }
}
new App();
