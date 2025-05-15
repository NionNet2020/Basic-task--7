class NotesApp {
    constructor() {
        this.notes = [];
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.loadNotes();
        this.setupEventListeners();
        this.setupOfflineDetection();
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then(() => console.log('Service Worker зарегистрирован'))
                .catch(err => console.error('Ошибка регистрации SW:', err));
        }
    }

    loadNotes() {
        const savedNotes = localStorage.getItem('notes');
        this.notes = savedNotes ? JSON.parse(savedNotes) : [];
        this.renderNotes();
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    addNote(text) {
        if (!text.trim()) return;
        
        const newNote = {
            id: Date.now(),
            content: text.trim(),
            date: new Date().toLocaleString()
        };
        
        this.notes.unshift(newNote);
        this.saveNotes();
        this.renderNotes();
    }

    deleteNote(id) {
        this.notes = this.notes.filter(note => note.id !== id);
        this.saveNotes();
        this.renderNotes();
    }

    renderNotes() {
        const notesList = document.getElementById('notesList');
        notesList.innerHTML = this.notes
            .map(note => `
                <div class="note-card">
                    <div class="note-content">${note.content}</div>
                    <div class="note-meta">
                        <small>${note.date}</small>
                        <button class="delete-btn" onclick="notesApp.deleteNote(${note.id})">
                            Удалить
                        </button>
                    </div>
                </div>
            `)
            .join('');
    }

    setupEventListeners() {
        document.getElementById('addNote').addEventListener('click', () => {
            const textarea = document.getElementById('noteText');
            this.addNote(textarea.value);
            textarea.value = '';
        });
    }

    setupOfflineDetection() {
        const statusElement = document.getElementById('status');
        
        const updateStatus = () => {
            if (!navigator.onLine) {
                statusElement.classList.add('offline-status');
                statusElement.textContent = 'Офлайн-режим';
                statusElement.style.display = 'inline';
            } else {
                statusElement.style.display = 'none';
            }
        };

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        updateStatus();
    }
}

const notesApp = new NotesApp();