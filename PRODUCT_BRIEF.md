Product Brief v0.1
A coach-only MVP for managing players, planning sessions, creating tactical diagrams, and exporting PDFs.

MVP Principle
Version 0.1 should stay simple, practical, and focused on real weekly coaching tasks.
The first release must prove the core workflow before adding AI, chat, logins, payments, or advanced club-management features.

Item	Decision
Product type	Football coaching management web app
Primary user	Head coach
First version focus	Player profiles, training session planning, basic tactical board, PDF export
Data storage	Browser localStorage only
Not included in v0.1	AI, player login, team chat, cloud database, payment system, mobile app
Definition of success	A coach can manage players, create a session, build a simple diagram, and export a useful PDF.

1. Product Summary
Coach Command Centre is a football coaching management tool designed for head coaches.
The first version helps a coach manage player profiles, create training session plans, build simple tactical diagrams, and export session plans as PDF documents.
This version is not intended to be a full football club management platform yet. It is a simple MVP that focuses on the core workflow of a football coach:
Manage players -> Plan training -> Create tactical diagrams -> Export and use on the pitch
2. Target User
The first version is designed for one main user: the head coach.
The head coach should be able to use the app independently to manage a squad, plan sessions, and prepare training documents.
Version 0.1 will not include:
Player login
Team chat
Assistant coach accounts
Parent accounts
Multi-user collaboration
Cloud database
AI generation
Payment system
The goal is to keep the first version simple and focused.
3. Product Vision
Many football coaches manage their team information across different tools, such as WhatsApp, Google Sheets, paper notebooks, PDFs, tactical board apps, and notes on their phone.
Coach Command Centre aims to bring the most important coaching tasks into one place.
In the future, the product could become a complete football team operating system, including player management, training planning, match preparation, tactical analysis, team communication, player development tracking, and AI coaching support.
However, version 0.1 will only focus on the basic coach-only workflow.
4. Version 0.1 Core Goal
The first version should allow a coach to complete four main tasks:
1.  Add and manage basic profiles for around 20 players
2.  Create and edit a football training session plan
3.  Use a simple tactical board to place players and create basic diagrams
4.  Export the session plan and tactical diagram as a PDF
The app should feel simple, clear, and practical for a football coach to use.
5. Core Features for Version 0.1
A. Player Profiles
Purpose
The Player Profiles feature allows the coach to store basic information about each player in the squad. The coach should be able to add, view, edit, and delete players.
This is the foundation for future features such as lineup planning, player development tracking, attendance, match statistics, and AI recommendations.
Required Player Fields
Full name
Shirt number
Age
Main position
Secondary position
Preferred foot
Technical rating
Physical rating
Tactical understanding rating
Mentality / attitude rating
Strengths
Areas to improve
Coach notes
Rating System
The four rating categories should use a simple 1-10 scale:
Technical
Physical
Tactical
Mental
Example Rating	Score
Technical	7/10
Physical	8/10
Tactical	6/10
Mental	9/10

Player Profile Actions
Add a new player
View a list of all players
Open an individual player profile
Edit player details
Delete a player
Save player data locally
First Version Notes
The first version does not need advanced analytics, graphs, or automatic recommendations. A clean profile layout with clear information is enough.
B. Training Session Planner
Purpose
The Training Session Planner allows the coach to create and edit a football training session plan. The coach should be able to manually write the session content and save it.
AI generation is not required for version 0.1.
Required Session Fields
Session title
Date
Training topic
Duration
Number of players
Training objective
Warm-up
Main practice
Small-sided game
Coaching points
Player questions
Equipment list
Coach notes
Example Session Structure
Field	Example Content
Session Title	U10 Possession and Creating Space
Date	12 May 2026
Topic	Possession
Duration	60 minutes
Players	12
Objective	Help players understand how to create passing angles and support the player on the ball.
Warm-up	Passing gates with movement and scanning.
Main Practice	4v4+2 possession game.
Small-Sided Game	6v6 directional game with end zones.
Coaching Points	Create passing angles; scan before receiving; open body shape; support quickly after passing.
Player Questions	Where can you move to help your teammate? What should you check before receiving? How can we make the pitch bigger when we have the ball?
Equipment	Balls, cones, bibs, mini goals.
Coach Notes	Focus on asking questions instead of giving too many direct instructions.

Session Planner Actions
Create a new session
Edit an existing session
Save a session
View saved sessions
Delete a session
Export a session as PDF
First Version Notes
The first version does not need automatic AI session generation. The coach writes the content manually.
Later versions may add session templates, AI session generation, a drill library, weekly training plans, and season plans.
C. Basic Tactical Board
Purpose
The Tactical Board allows the coach to create simple football diagrams. The coach should be able to place players on a pitch and create basic visual explanations for training sessions or tactical ideas.
This does not need to be a professional-level animation tool in version 0.1. The goal is to create a simple visual board that can support the training plan.
Required Tactical Board Features
View a simple football pitch
Add player markers
Drag player markers around the pitch
Add a ball marker
Add cone markers
Draw simple arrows or lines
Clear the board
Save the current board state
Include the board diagram in the PDF export if possible
Tactical Board Objects
Player circle
Ball
Cone
Arrow
Line
Example Use Cases
Player starting positions
A possession practice setup
A small-sided game layout
A pressing shape
A passing pattern
A corner routine
A defensive shape
First Version Notes
The tactical board should be simple. It does not need animation, 3D graphics, advanced drawing tools, match simulation, or player movement playback.
The main goal is to help the coach visually explain a session.
D. PDF Export
Purpose
The PDF Export feature allows the coach to turn a training session into a document that can be printed, saved, or shared. This is important because coaches often need to bring session plans to the pitch or share them with assistant coaches.
PDF Should Include
Session title
Date
Topic
Duration
Number of players
Training objective
Warm-up
Main practice
Small-sided game
Coaching points
Player questions
Equipment list
Coach notes
Tactical board diagram, if available
PDF Actions
Click an Export PDF button
Generate a readable session plan PDF
Download the PDF file
First Version Notes
The PDF does not need to be visually perfect in version 0.1. The priority is that the PDF is readable, structured, and useful for a coach. Later versions can improve the PDF design.
6. Data Storage for Version 0.1
Version 0.1 should not use a cloud database. All data should be stored in the browser using localStorage.
Storage Decision	Version 0.1
Login required	No
Server required	No
Cloud database required	No
API cost	None
Stored data	Player profiles, training sessions, tactical board state

Important Limitation
Because the app uses localStorage, data will only be saved in the user’s current browser. If the user clears browser data or changes device, the data may be lost.
This is acceptable for version 0.1. Future versions may upgrade to a cloud database such as Supabase or Firebase.
7. Out of Scope for Version 0.1
The following features should not be included in the first version:
AI session generation
OpenAI API integration
Player login
Team chat
Cloud database
Multi-user collaboration
League table
Goal scorer leaderboard
Assist leaderboard
Match centre
Opposition analysis
Video analysis
Payment system
Mobile app
Push notifications
Advanced tactical animation
Full club management system
These features may be considered in future versions. The first version must stay simple and focused.
8. Main Pages for Version 0.1
Page	Main Purpose
Dashboard	Shows total players, saved sessions, quick action buttons, latest saved session, and a link to the tactical board.
Players Page	Allows the coach to view the player list, add players, edit players, delete players, and open individual profiles.
Session Planner Page	Allows the coach to create, edit, save, delete, and export training sessions.
Tactical Board Page	Allows the coach to use a football pitch area, add player markers, add a ball, add cones, draw lines or arrows, clear the board, and save the board.

9. User Flow for Version 0.1
A typical coach workflow should look like this:
1.  Coach opens the app
2.  Coach adds players to the squad
3.  Coach creates a training session
4.  Coach opens the tactical board
5.  Coach creates a simple diagram
6.  Coach saves the session
7.  Coach exports the session as PDF
8.  Coach uses the PDF for training
This workflow should be simple and easy to understand.
10. Design Requirements
The design should be:
Clean
Modern
Simple
Football-focused
Easy to use
Mobile-friendly where possible
Clear enough for a non-technical coach
The app should not feel overloaded. The first version should prioritise usability over complex design.
Suggested Visual Style
Dark green, white, black, and grey football-inspired theme
Card-based layout
Clear buttons
Simple navigation
Large readable text
Clean forms
11. Technical Requirements
Preferred Technology	Purpose
React	Build the interactive web app interface.
Vite	Create and run the front-end development project.
localStorage	Save players, sessions, and tactical board state in the browser.
jsPDF	Generate downloadable PDF files.
html2canvas	Capture the tactical board or session layout for PDF export if needed.

The app should not require a backend server, database, login system, API keys, OpenAI API, or payment integration in version 0.1.
The app should be able to run locally during development.
12. Development Order for Codex
The app should be built in the following order:
1.  Create the React + Vite project structure
2.  Build the main layout and navigation
3.  Build the Dashboard page
4.  Build the Players page with add, edit, delete, and localStorage saving
5.  Build the Session Planner page with create, edit, delete, and localStorage saving
6.  Build the Basic Tactical Board with draggable markers
7.  Add PDF export for the session plan
8.  Improve styling and mobile usability
9.  Test all core features
10.  Fix bugs before adding any new features
Important Instruction for Codex
Do not add future-version features until version 0.1 is working properly.
Keep the app simple and explain the project structure in beginner-friendly language after implementation.

13. Success Criteria
Version 0.1 will be considered complete when:
1.  The coach can add at least 20 players
2.  The coach can view, edit, and delete player profiles
3.  The coach can create and edit a training session
4.  The coach can save training sessions locally
5.  The coach can open a tactical board
6.  The coach can drag player markers on the tactical board
7.  The coach can save the tactical board state
8.  The coach can export a session plan as PDF
9.  The PDF includes the key session information
10.  The app works on desktop
11.  The app is usable on mobile
12.  The app has a clean and simple interface

14. Future Version Ideas
Version 0.2
Better tactical board tools
Improved PDF design
Session templates
Player development plans
Attendance tracking
Version 0.3
Match centre
Lineup builder
Formation planner
Match stats
Goals and assists tracking
Player ratings after matches
Version 0.4
Player login
Availability check
Team announcements
Player personal profile view
Coach-to-player feedback
Version 0.5
Cloud database
User accounts
Multi-team support
Assistant coach access
Club admin access
Version 1.0
AI coaching assistant
AI session generation
Opposition analysis
Season planning
Set-piece designer
Video analysis
Team chat
Subscription system

15. Product Principle
The first version should not try to become a complete football club platform immediately.
The priority is to build a simple and useful tool that helps a coach with real weekly coaching tasks.
The product should start small, work properly, and improve over time.
Version 0.1 should prove that the core idea works: a coach can manage players, plan a session, create a tactical diagram, and export a useful PDF from one place.
