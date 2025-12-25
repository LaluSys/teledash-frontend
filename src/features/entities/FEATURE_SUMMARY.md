# Entity Explorer Feature

Complete Named Entity Recognition (NER) feature for the ARAI text analysis system.

## Installation Requirements

Before using this feature, install the required D3.js dependency:

```bash
npm install d3 @types/d3
```

## File Structure

```
/home/lalu-sys/ARAI-Setup/teledash-frontend/src/features/entities/
├── api/
│   ├── getEntities.ts          # List entities with filters
│   ├── getEntity.ts            # Get single entity details
│   ├── getEntityMessages.ts    # Messages mentioning an entity
│   ├── getEntityNetwork.ts     # Co-occurrence network data
│   ├── triggerNER.ts           # Trigger NER extraction
│   └── index.ts                # API exports
├── components/
│   ├── EntityCard.tsx          # Entity display card
│   ├── EntityList.tsx          # Paginated entity list with filters
│   ├── EntityNetworkGraph.tsx  # D3.js force-directed graph
│   ├── EntityTypeFilter.tsx    # Filter by entity type
│   ├── TriggerNERButton.tsx    # Button to trigger NER extraction
│   └── index.ts                # Component exports
├── routes/
│   ├── EntityExplorer.tsx      # Main page with tabs (List & Network)
│   ├── EntityDetail.tsx        # Single entity view
│   └── index.ts                # Route exports
└── index.ts                    # Feature exports
```

## Features

### 1. Entity List View
- Display all extracted entities with type badges
- Filter by entity type (PERSON, ORG, LOC, EVENT, MISC)
- Filter by minimum frequency
- Adjustable result limit (25, 50, 100, 200)
- Shows frequency, date range, and primary chats

### 2. Network Graph View
- Interactive D3.js force-directed graph
- Node size based on entity frequency
- Color-coded by entity type:
  - PERSON: Blue
  - ORG: Purple
  - LOC: Green
  - EVENT: Orange
  - MISC: Gray
- Features:
  - Click nodes to navigate to entity details
  - Hover tooltips showing entity info
  - Zoom and pan interactions
  - Drag nodes to rearrange
  - Filter by entity types
  - Adjust minimum co-occurrence threshold
  - Limit maximum nodes displayed

### 3. Entity Detail View
- Complete entity information
- Timeline (first seen, last seen)
- Primary chats where entity appears
- Co-occurrence network focused on selected entity
- Message list with entity highlighting
- Click-through to chat view

### 4. NER Extraction
- Trigger button to run Named Entity Recognition
- Modal confirmation dialog
- Progress notifications
- Option to update existing entities

## API Integration

The feature integrates with the following backend endpoints:

```typescript
// List entities
GET /text-analysis/entities
  params: {
    type?: "PERSON" | "ORG" | "LOC" | "EVENT" | "MISC"
    min_frequency?: number
    limit?: number
    offset?: number
    chat_ids?: string[]
  }

// Get single entity
GET /text-analysis/entities/{entity_id}

// Get messages containing entity
GET /text-analysis/entities/{entity_id}/messages
  params: {
    limit?: number
    offset?: number
  }

// Get entity co-occurrence network
GET /text-analysis/entities/network
  params: {
    chat_ids?: string[]
    entity_types?: EntityType[]
    min_cooccurrence?: number
    max_nodes?: number
  }

// Trigger NER extraction
POST /text-analysis/entities/trigger
  body: {
    chat_ids?: string[]
    min_messages?: number
    update_existing?: boolean
  }
```

## Usage

### Adding Routes

Add the following routes to your router configuration:

```typescript
import { EntityExplorer, EntityDetail } from "features/entities";

// In your routes file:
{
  path: "/entities",
  element: <EntityExplorer />
},
{
  path: "/entities/:entityId",
  element: <EntityDetail />
}
```

### Using Components

```typescript
// Use the entire feature
import { EntityExplorer, EntityDetail } from "features/entities";

// Use individual components
import { EntityList, EntityNetworkGraph } from "features/entities/components";

// Use API hooks
import { useEntities, useEntityNetwork } from "features/entities/api";
```

## Component Props

### EntityNetworkGraph
```typescript
interface EntityNetworkGraphProps {
  data: EntityNetwork;    // Network data with nodes and edges
  width?: number;         // Default: 800
  height?: number;        // Default: 600
}
```

### EntityCard
```typescript
interface EntityCardProps {
  entity: Entity;         // Entity object to display
}
```

### EntityTypeFilter
```typescript
interface EntityTypeFilterProps {
  selectedType?: EntityType;
  onTypeChange: (type: EntityType | undefined) => void;
}
```

## TypeScript Types

### Entity Types
```typescript
type EntityType = "PERSON" | "ORG" | "LOC" | "EVENT" | "MISC";

interface Entity {
  entity_id: string;
  text: string;
  entity_type: EntityType;
  frequency: number;
  first_seen?: string;
  last_seen?: string;
  message_ids?: string[];
  metadata?: {
    primary_chats?: string[];
    related_topics?: string[];
  };
}

interface EntityNetwork {
  nodes: EntityNode[];
  edges: EntityEdge[];
}

interface EntityNode {
  id: string;
  name: string;
  entity_type: EntityType;
  frequency: number;
}

interface EntityEdge {
  source: string;
  target: string;
  weight: number;
  cooccurrence_count: number;
}
```

## Dependencies Used

- **React**: Component framework
- **TypeScript**: Type safety
- **TanStack Query**: Data fetching and caching
- **React Router**: Navigation
- **Tailwind CSS**: Styling
- **Headless UI**: Tab components
- **D3.js**: Force-directed network graph (REQUIRES INSTALLATION)
- **@mdi/react**: Icons
- **Zustand**: Notification state management

## Navigation Flow

```
/entities (EntityExplorer)
  ├── Tab: Entity List
  │   └── Click entity → /entities/:entityId
  └── Tab: Network Graph
      └── Click node → /entities/:entityId

/entities/:entityId (EntityDetail)
  ├── Entity overview
  ├── Co-occurrence network
  └── Message list
      └── Click "View in chat" → /chats/:chatId
```

## Color Coding

Entity types are consistently color-coded throughout the application:

- **PERSON**: Blue (`bg-blue-100 text-blue-800`)
- **ORG**: Purple (`bg-purple-100 text-purple-800`)
- **LOC**: Green (`bg-green-100 text-green-800`)
- **EVENT**: Orange (`bg-orange-100 text-orange-800`)
- **MISC**: Gray (`bg-gray-100 text-gray-800`)

## Performance Considerations

- Network graph limits nodes to prevent performance issues
- Message lists are limited to 50 by default
- Entity list supports pagination via limit parameter
- D3 simulation stops when component unmounts
- Tooltip cleanup on component unmount
- React Query caching reduces API calls

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- ARIA labels where appropriate
- Color coding supplemented with text labels
- Focus states on interactive elements

## Future Enhancements

Possible improvements:
- Server-side pagination for entity lists
- Export network graph as image
- Advanced filtering (date ranges, chat selection)
- Entity timeline visualization
- Bulk entity management
- Entity merging/disambiguation
- Custom entity types
- Entity sentiment analysis
