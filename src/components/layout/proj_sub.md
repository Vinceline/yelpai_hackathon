## Inspiration

I've been in too many situations in unfamiliar parts of town desperately needing a restroom or water. Google Maps gives exhaustive lists, but results are often wrong—places are closed, not public, or out of business. I don't want to waste time on places that won't work.

**GottaGo** solves this by understanding your needs and delivering accurate, AI-curated results instantly.

## What it does

**GottaGo** is an accessibility-focused app that helps users find:
- 🚻 Public restrooms (wheelchair accessible & gender-neutral)
- 💧 Water fountains and refill stations
- 🍲 Free food and community resources
- 🔧 Free air for tires
- ♿ Accessible facilities

Using Yelp's conversational AI, ask natural questions like "Which are open 24/7?" or "What's closest?" and get specific, intelligent answers—not generic lists.

## How we built it

**Frontend:** React, Leaflet maps, WCAG AA accessible dark UI, smart per-category caching

**Backend:** Express.js proxy server, Yelp AI API with chat_id for conversational context, OpenStreetMap geocoding

**Key Features:**
- Conversational AI maintains context across questions
- Urgency modes (Emergency/Soon/Chill) adapt AI behavior  
- Smart caching prevents redundant API calls
- Keyboard navigation, screen reader support, accessibility badges

## Challenges we ran into

1. **Category filtering** - Results weren't updating when switching tabs. Fixed with smart caching using React hooks.

2. **Poor UI contrast** - Dark theme had readability issues. Improved with lighter colors and gradients.

3. **Generic AI responses** - Chat gave useless "I found results" messages. Built context-aware parser that understands intent and filters results intelligently.

4. **Redundant API calls** - Implemented per-category caching that fetches data once per location.

5. **Accessibility irony** - Building an accessibility app that wasn't accessible. Added full WCAG AA compliance throughout.

## Accomplishments that we're proud of

This is **production-ready** and could launch tomorrow.

**Social Impact:**
- Serves 61 million Americans with disabilities
- Helps people experiencing homelessness find free food
- Provides gender-neutral restroom info for LGBTQ+ community
- Emergency mode for urgent needs

**Technical Excellence:**
- Properly implements Yelp's conversational AI with chat_id
- Context-aware responses ("top choice", "24/7", "closest")
- Smart caching improves UX and reduces costs

**Beyond privileged users:** Most apps ignore basic human needs. GottaGo addresses dignity—free food for unhoused individuals, actual accessibility info, gender-neutral facilities. We're not just building for accessibility—we're making accessible tech.

## What we learned

1. **Empathy in design** - Look beyond your own problems to who else struggles
2. **Yelp AI API** - Conversational chat_id context is powerful for refinement
3. **Accessibility is intentional** - Requires effort at every level, not an afterthought
4. **Smart caching** - Dramatically improves UX with instant tab switches
5. **AI needs specificity** - Generic responses are useless; context-aware answers help

## What's next for GottaGo

**Short-term:** Voice control, user reports, community validation, PWA for offline use

**Long-term:** Partner with disability orgs, expand globally, integrate with city planning, and add more categories (EV charging, lactation rooms, cooling centers)

**When you gotta go, you have GottaGo!** 