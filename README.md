# Phaint

## ❓Introduction

Phaint is an innovative real-time collaborative drawing and interaction platform. Designed for teams and creatives,
Phaint enables users to co-create on a shared canvas, seamlessly adding interactive behaviors and actions to their creations.
With an intuitive interface and powerful features, Phaint bridges creativity and collaboration.

## 🚀 Features
- Real time Collaboration &rarr; Multiple users can draw on the same canvas simultaneously, ensuring a smooth and synchronous 
    collaboration experience
- Interactive Behaviours &rarr; Assign actions and behaviors to elements on the canvas to bring your ideas to life
- Customizable Tools &rarr; A rich set of drawing tools, including freehand, shapes, and precision alignments
- Cloud-based Canvas Storage &rarr; Save your work in the cloud and access it anytime, anywhere
- Version Control &rarr; Track and restore previous versions of the canvas effortlessly
- User Roles and Permissions &rarr; Manage participants with role-based permissions for secure collaboration

## 📈 Milestones
1. Core canvas implementation
    - [ ] Basic drawing tools: pen, shapes, eraser
    - [ ] Real-time synchronization for multiple users
    - [ ] Color and layer management
2. Interactive features
   - [ ] Add behavior/interaction assignment to drawn elements
   - [ ] Support for animated elements
   - [ ] Drag-and-drop action linking
3. User management and collaboration
   - [ ] Role-base access control
   - [ ] Comments and annotations
   - [ ] Canvas sharing via secure links
4. Advanced Enhancements
   - [ ] Integration with external APIs for exporting designs
   - [ ] Support for templates and reusable elements
   - [ ] Offline mode with automatic synchronization

## 🤝 Collaborating

### Developing
Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```
### Building
To create a production version of your app:

```bash
npm run build
```
You can preview the production build with `npm run preview`.
> To deploy your app, you may need to install an adapter for your target environment.


## 🛠️ Installation

### Prerequisites
- Node.js (vX.XX)
- npm (vX)

### Getting started
Clone the repository
```bash
git clone git@github.com:drptms/phaint.git
cd phaint
```

Install dependencies
```bash
npm install
```

Start the application
```bash
npm run
```