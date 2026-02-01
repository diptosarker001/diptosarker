// private/assistant.js
// AI সহকারীর এডভান্সড লজিক

class PersonalAssistant {
    constructor() {
        this.memory = this.loadMemory();
        this.userName = 'দীপ্ত';
        this.initialize();
    }

    initialize() {
        console.log('Personal Assistant initialized');
        this.setupEventListeners();
        this.loadUserData();
    }

    loadMemory() {
        const savedMemory = localStorage.getItem('ai_assistant_memory');
        return savedMemory ? JSON.parse(savedMemory) : {
            conversations: [],
            preferences: {},
            learnedData: {}
        };
    }

    saveMemory() {
        localStorage.setItem('ai_assistant_memory', JSON.stringify(this.memory));
    }

    setupEventListeners() {
        // চ্যাট ইনপুট হ্যান্ডলার
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.processUserMessage(chatInput.value);
                    chatInput.value = '';
                }
            });
        }
    }

    loadUserData() {
        // প্রোফাইল ডাটা লোড
        fetch('../data/profile.json')
            .then(response => response.json())
            .then(profile => {
                this.userProfile = profile;
                console.log('User profile loaded:', profile);
            })
            .catch(error => {
                console.error('Error loading profile:', error);
                this.userProfile = this.getDefaultProfile();
            });

        // নোটস লোড
        fetch('../data/notes.json')
            .then(response => response.json())
            .then(notes => {
                this.userNotes = notes;
            })
            .catch(error => {
                console.error('Error loading notes:', error);
                this.userNotes = [];
            });

        // টাস্কস লোড
        fetch('../data/tasks.json')
            .then(response => response.json())
            .then(tasks => {
                this.userTasks = tasks;
            })
            .catch(error => {
                console.error('Error loading tasks:', error);
                this.userTasks = [];
            });
    }

    getDefaultProfile() {
        return {
            name: "দীপ্ত সরকার",
            title: "ওয়েব ডেভেলপার",
            skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
            projects: [
                "পার্সোনাল ওয়েবসাইট",
                "ই-কমার্স প্ল্যাটফর্ম",
                "টাস্ক ম্যানেজমেন্ট অ্যাপ"
            ]
        };
    }

    processUserMessage(message) {
        if (!message.trim()) return;

        // কনভারসেশন সেভ
        this.memory.conversations.push({
            type: 'user',
            message: message,
            timestamp: new Date().toISOString()
        });

        // AI রেসপন্স জেনারেট
        const response = this.generateResponse(message);
        
        // রেসপন্স সেভ
        this.memory.conversations.push({
            type: 'assistant',
            message: response,
            timestamp: new Date().toISOString()
        });

        // মেমোরি সেভ
        this.saveMemory();

        // UI আপডেট
        this.updateChatUI(message, response);
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // প্রি-ডিফাইনড রেসপন্সেস
        const responses = {
            greeting: [
                `হ্যালো ${this.userName}! কিভাবে আপনাকে সাহায্য করতে পারি?`,
                `আসসালামু আলাইকুম ${this.userName}! আজকে কেমন আছেন?`,
                `স্বাগতম ${this.userName}! আমি আপনার AI সহকারী।`
            ],
            about: [
                `আপনার সম্পর্কে বলতে গেলে, আপনি একজন ওয়েব ডেভেলপার। আপনার স্কিলসের মধ্যে রয়েছে: ${this.userProfile?.skills?.join(', ') || 'HTML, CSS, JavaScript'}`,
                `আপনি ${this.userProfile?.title || 'ওয়েব ডেভেলপার'} হিসেবে কাজ করেন।`,
                `আপনার প্রজেক্টগুলোর মধ্যে রয়েছে: ${this.userProfile?.projects?.slice(0, 3).join(', ') || 'পার্সোনাল ওয়েবসাইট'}`
            ],
            help: [
                "আমি আপনাকে সাহায্য করতে পারি: টাস্ক ম্যানেজমেন্ট, নোট টেকিং, তথ্য সার্চ, রিমাইন্ডার সেট করা, এবং আপনার প্রশ্নের উত্তর দেওয়া।",
                "আপনি আমাকে জিজ্ঞাসা করতে পারেন:\n• আজকের টাস্কস\n• নতুন নোট তৈরি\n• তারিখ-সময়\n• আপনার প্রজেক্ট সম্পর্কে\n• টেকনিক্যাল প্রশ্ন"
            ],
            tasks: this.getTaskSummary(),
            notes: this.getNotesSummary(),
            time: `বর্তমান সময়: ${new Date().toLocaleTimeString('bn-BD')}, তারিখ: ${new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
            weather: "আমি এখনো বর্তমান আবহাওয়ার তথ্য পাচ্ছি না। কিন্তু আপনি অনলাইনে চেক করতে পারেন।",
            joke: [
                "প্রোগ্রামারদের জীবন: রাত জেগে কোড লেখা, দিনে বাগ ফিক্স করা!",
                "কম্পাইলার বলছে: 'এটা কাজ করবে না' - প্রোগ্রামার বলে: 'কিন্তু আমার মেশিনে তো কাজ করছে!'"
            ]
        };

        // মেসেজ এনালাইসিস
        if (lowerMessage.includes('হ্যালো') || lowerMessage.includes('হাই') || lowerMessage.includes('আসসালাম')) {
            return this.getRandomResponse(responses.greeting);
        }
        else if (lowerMessage.includes('তোমার কি কাজ') || lowerMessage.includes('তুমি কি করতে পার')) {
            return this.getRandomResponse(responses.help);
        }
        else if (lowerMessage.includes('দীপ্ত') || lowerMessage.includes('তোমার মালিক') || lowerMessage.includes('ওনার সম্পর্কে')) {
            return this.getRandomResponse(responses.about);
        }
        else if (lowerMessage.includes('টাস্ক') || lowerMessage.includes('কাজ')) {
            return responses.tasks;
        }
        else if (lowerMessage.includes('নোট') || lowerMessage.includes('মনে রাখ')) {
            return responses.notes;
        }
        else if (lowerMessage.includes('সময়') || lowerMessage.includes('তারিখ')) {
            return responses.time;
        }
        else if (lowerMessage.includes('মজা') || lowerMessage.includes('জোক')) {
            return this.getRandomResponse(responses.joke);
        }
        else if (lowerMessage.includes('আবহাওয়া')) {
            return responses.weather;
        }
        else {
            return this.getDefaultResponse();
        }
    }

    getRandomResponse(responsesArray) {
        return responsesArray[Math.floor(Math.random() * responsesArray.length)];
    }

    getDefaultResponse() {
        const defaults = [
            "আমি এখনো সেই প্রশ্নের উত্তর জানি না। আপনি অন্য কিছু জিজ্ঞাসা করতে পারেন।",
            "দুঃখিত, আমি এখনো সেই তথ্য শিখিনি।",
            "আপনি কি দীপ্ত সরকার সম্পর্কে কিছু জানতে চান?",
            "টাস্ক বা নোট ম্যানেজমেন্টে সাহায্য করতে পারি।"
        ];
        return this.getRandomResponse(defaults);
    }

    getTaskSummary() {
        if (!this.userTasks || this.userTasks.length === 0) {
            return "আপনার কোনো টাস্ক নেই। নতুন টাস্ক যোগ করতে বলুন।";
        }

        const pending = this.userTasks.filter(task => !task.completed);
        const completed = this.userTasks.filter(task => task.completed);
        
        return `আপনার মোট ${this.userTasks.length}টি টাস্ক রয়েছে:\n• পেন্ডিং: ${pending.length}\n• কমপ্লিটেড: ${completed.length}\n\nসবচেয়ে গুরুত্বপূর্ণ টাস্ক: ${pending[0]?.title || 'না'}`;
    }

    getNotesSummary() {
        if (!this.userNotes || this.userNotes.length === 0) {
            return "আপনার কোনো নোট নেই। নতুন নোট তৈরি করতে বলুন।";
        }

        const recentNotes = this.userNotes.slice(0, 3);
        let summary = `আপনার ${this.userNotes.length}টি নোট রয়েছে। সাম্প্রতিক নোট:\n`;
        
        recentNotes.forEach((note, index) => {
            summary += `${index + 1}. ${note.title}\n`;
        });

        return summary;
    }

    updateChatUI(userMessage, aiResponse) {
        // চ্যাট UI আপডেট
        const chatContainer = document.getElementById('chatMessages') || 
                              document.getElementById('dashboardChat');
        
        if (chatContainer) {
            // ইউজার মেসেজ
            const userMsgDiv = document.createElement('div');
            userMsgDiv.className = 'message user-message';
            userMsgDiv.innerHTML = `
                <div class="message-content">
                    <strong>আপনি:</strong> ${userMessage}
                </div>
            `;
            chatContainer.appendChild(userMsgDiv);

            // AI রেসপন্স
            const aiMsgDiv = document.createElement('div');
            aiMsgDiv.className = 'message';
            aiMsgDiv.innerHTML = `
                <div class="message-content">
                    <strong>AI:</strong> ${aiResponse}
                </div>
            `;
            chatContainer.appendChild(aiMsgDiv);

            // স্ক্রল নিচে
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    // টাস্ক ম্যানেজমেন্ট ফাংশনস
    addTask(taskTitle, priority = 'medium') {
        const newTask = {
            id: Date.now(),
            title: taskTitle,
            priority: priority,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.userTasks.push(newTask);
        this.saveTasks();
        return newTask;
    }

    completeTask(taskId) {
        const task = this.userTasks.find(t => t.id === taskId);
        if (task) {
            task.completed = true;
            task.completedAt = new Date().toISOString();
            this.saveTasks();
        }
    }

    saveTasks() {
        // ডাটাবেসে সেভ করবে (এখন লোকালস্টোরেজ)
        localStorage.setItem('user_tasks', JSON.stringify(this.userTasks));
    }

    // নোট ম্যানেজমেন্ট ফাংশনস
    addNote(title, content) {
        const newNote = {
            id: Date.now(),
            title: title,
            content: content,
            createdAt: new Date().toISOString(),
            tags: []
        };

        this.userNotes.push(newNote);
        this.saveNotes();
        return newNote;
    }

    saveNotes() {
        localStorage.setItem('user_notes', JSON.stringify(this.userNotes));
    }
}

// গ্লোবাল ইনিশিয়ালাইজেশন
window.addEventListener('DOMContentLoaded', function() {
    window.personalAssistant = new PersonalAssistant();
    
    // কুইক স্টার্ট
    setTimeout(() => {
        const greeting = window.personalAssistant.generateResponse('হ্যালো');
        window.personalAssistant.updateChatUI('হ্যালো', greeting);
    }, 1000);
});