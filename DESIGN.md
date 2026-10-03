# ręcovery visual direction

Applied skill: [Anthropic frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md), read online on 2026-10-03. Found via skills.sh. Applied to this build without installing a global plugin.

## Direction

A personal mobile recovery companion based on the user's supplied upload, exercise and progress references. The first screen contains only the X-ray upload; anatomy appears only after upload and confirmation. No example bypass.

Core palette: white #FFFFFF, ink #172C30, action teal #008783, pale teal #E8F5F3. Anatomy labels use readable versions of the render's red bone marker, coral muscles and gold tendons. These colours identify structures, not severity.

Typography: Avenir Next on Apple platforms, platform sans-serif fallback elsewhere. Large regular-weight headings, comfortable body text, sentence case and minimal metadata.

One phone-first column, fixed header and bottom navigation. On larger screens the preview stays within 480px. No desktop sidebar. Session controls stay fixed above the tab bar. The upload/hand/plan stepper remains, alongside session, baseline and range progress bars. Exercises use compact cards; progress uses the supplied reference's metric tiles and bar chart pattern.

## Design review

Replaced the previous hand-shaped SVG, unrelated cyan tendon colours and false connection status. Use the supplied render unmodified and call it a reference illustration. No fake confidence scores or pretend clinical approval. An uploaded X-ray remains local and is never interpreted by this prototype.

## Asset provenance

`assets/hand-reference.png` is the image supplied by the user for this redesign. It is a static reference render, not a reconstruction of an uploaded scan or an interactive 3D model. The app uses it locally without sending it to an external service.

`assets/aparat-reference.jpeg` is the user's supplied generated exercise-screen reference. The UI clips to its product-photo region. It is a concept illustration, not a photograph of functioning hardware.
