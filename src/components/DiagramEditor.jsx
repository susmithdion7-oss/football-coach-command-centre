import { useRef, useState } from 'react'
import { createEmptyDiagram, normaliseDiagram } from './DiagramPreview.jsx'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function createObjectId(type) {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }

  return `${type}-${Date.now()}`
}

function getPointFromEvent(event, svgElement) {
  const rect = svgElement.getBoundingClientRect()

  return {
    x: clamp(((event.clientX - rect.left) / rect.width) * 100, 2, 98),
    y: clamp(((event.clientY - rect.top) / rect.height) * 60, 2, 58),
  }
}

function getPlayerLabel(type, objects) {
  const prefixByType = {
    homePlayer: 'H',
    awayPlayer: 'A',
    neutralPlayer: 'N',
  }
  const prefix = prefixByType[type]
  const count = objects.filter((object) => object.type === type).length + 1

  return `${prefix}${count}`
}

function createDiagramObject(type, objects) {
  const baseObject = {
    id: createObjectId(type),
    type,
    x: clamp(20 + objects.length * 4, 5, 82),
    y: clamp(18 + objects.length * 3, 5, 50),
  }

  if (type === 'homePlayer' || type === 'awayPlayer' || type === 'neutralPlayer') {
    return {
      ...baseObject,
      label: getPlayerLabel(type, objects),
    }
  }

  if (type === 'area') {
    return {
      ...baseObject,
      width: 24,
      height: 14,
    }
  }

  if (type === 'arrow') {
    return {
      ...baseObject,
      width: 18,
      height: -8,
    }
  }

  return baseObject
}

function PitchLines() {
  return (
    <>
      <rect className="diagram-pitch-border" x="2" y="2" width="96" height="56" rx="1" />
      <line className="diagram-pitch-line" x1="50" y1="2" x2="50" y2="58" />
      <circle className="diagram-pitch-line" cx="50" cy="30" r="8" />
      <circle className="diagram-pitch-spot" cx="50" cy="30" r="0.7" />
      <rect className="diagram-pitch-line" x="2" y="18" width="14" height="24" />
      <rect className="diagram-pitch-line" x="84" y="18" width="14" height="24" />
      <rect className="diagram-pitch-line" x="2" y="24" width="6" height="12" />
      <rect className="diagram-pitch-line" x="92" y="24" width="6" height="12" />
    </>
  )
}

function InteractiveDiagramObject({ object, onPointerDown, selected }) {
  const highlightClass = selected ? ' selected' : ''

  if (object.type === 'area') {
    return (
      <rect
        className={`diagram-object diagram-area${highlightClass}`}
        height={object.height || 14}
        onPointerDown={(event) => onPointerDown(event, object.id)}
        width={object.width || 24}
        x={object.x}
        y={object.y}
      />
    )
  }

  if (object.type === 'arrow' || object.type === 'line') {
    return (
      <g
        className={`diagram-object diagram-arrow${highlightClass}`}
        onPointerDown={(event) => onPointerDown(event, object.id)}
      >
        <line
          markerEnd="url(#editor-arrow-head)"
          x1={object.x}
          x2={object.x + (object.width || 18)}
          y1={object.y}
          y2={object.y + (object.height || -8)}
        />
      </g>
    )
  }

  if (object.type === 'cone') {
    return (
      <path
        className={`diagram-object diagram-cone${highlightClass}`}
        d={`M ${object.x} ${object.y - 2.4} L ${object.x - 2.4} ${object.y + 2.4} L ${object.x + 2.4} ${object.y + 2.4} Z`}
        onPointerDown={(event) => onPointerDown(event, object.id)}
      />
    )
  }

  if (object.type === 'ball') {
    return (
      <g
        className={`diagram-object diagram-ball${highlightClass}`}
        onPointerDown={(event) => onPointerDown(event, object.id)}
      >
        <circle cx={object.x} cy={object.y} r="2.7" />
        <path d={`M ${object.x - 1.4} ${object.y} H ${object.x + 1.4} M ${object.x} ${object.y - 1.4} V ${object.y + 1.4}`} />
      </g>
    )
  }

  return (
    <g
      className={`diagram-object diagram-player ${object.type}${highlightClass}`}
      onPointerDown={(event) => onPointerDown(event, object.id)}
    >
      <circle cx={object.x} cy={object.y} r="3.3" />
      <text x={object.x} y={object.y + 1.1}>
        {object.label}
      </text>
    </g>
  )
}

function DiagramEditor({ activityName, diagram, onCancel, onSave }) {
  const [workingDiagram, setWorkingDiagram] = useState(() =>
    normaliseDiagram(diagram, `${activityName} diagram`),
  )
  const [selectedObjectId, setSelectedObjectId] = useState(null)
  const svgRef = useRef(null)
  const dragRef = useRef(null)

  function addObject(type) {
    setWorkingDiagram((currentDiagram) => {
      const nextObject = createDiagramObject(type, currentDiagram.objects)
      setSelectedObjectId(nextObject.id)

      return {
        ...currentDiagram,
        objects: [...currentDiagram.objects, nextObject],
      }
    })
  }

  function deleteSelectedObject() {
    if (!selectedObjectId) {
      return
    }

    setWorkingDiagram((currentDiagram) => ({
      ...currentDiagram,
      objects: currentDiagram.objects.filter((object) => object.id !== selectedObjectId),
    }))
    setSelectedObjectId(null)
  }

  function clearDiagram() {
    setWorkingDiagram((currentDiagram) => ({
      ...currentDiagram,
      objects: [],
    }))
    setSelectedObjectId(null)
  }

  function updateNotes(event) {
    setWorkingDiagram((currentDiagram) => ({
      ...currentDiagram,
      notes: event.target.value,
    }))
  }

  function startDrag(event, objectId) {
    event.preventDefault()
    event.stopPropagation()

    const svgElement = svgRef.current
    const selectedObject = workingDiagram.objects.find((object) => object.id === objectId)

    if (!svgElement || !selectedObject) {
      return
    }

    const point = getPointFromEvent(event, svgElement)
    setSelectedObjectId(objectId)
    dragRef.current = {
      objectId,
      offsetX: point.x - selectedObject.x,
      offsetY: point.y - selectedObject.y,
    }
    svgElement.setPointerCapture(event.pointerId)
  }

  function moveSelectedObject(event) {
    if (!dragRef.current || !svgRef.current) {
      return
    }

    const point = getPointFromEvent(event, svgRef.current)
    const { objectId, offsetX, offsetY } = dragRef.current

    setWorkingDiagram((currentDiagram) => ({
      ...currentDiagram,
      objects: currentDiagram.objects.map((object) => {
        if (object.id !== objectId) {
          return object
        }

        const maxX = object.type === 'area' ? 98 - (object.width || 24) : 98
        const maxY = object.type === 'area' ? 58 - (object.height || 14) : 58

        return {
          ...object,
          x: clamp(point.x - offsetX, 2, maxX),
          y: clamp(point.y - offsetY, 2, maxY),
        }
      }),
    }))
  }

  function stopDrag() {
    dragRef.current = null
  }

  function saveDiagram() {
    onSave({
      ...createEmptyDiagram(`${activityName} diagram`),
      ...workingDiagram,
      title: workingDiagram.title || `${activityName} diagram`,
    })
  }

  return (
    <div className="diagram-editor-panel">
      <div className="diagram-editor-heading">
        <div>
          <p className="section-kicker">Activity Diagram</p>
          <h4>{activityName}</h4>
          <p>Create a static setup for this activity. Select an object, drag it, then save the diagram.</p>
        </div>
      </div>

      <div className="diagram-toolbar">
        <button type="button" onClick={() => addObject('homePlayer')}>
          Add Home Player
        </button>
        <button type="button" onClick={() => addObject('awayPlayer')}>
          Add Away Player
        </button>
        <button type="button" onClick={() => addObject('neutralPlayer')}>
          Add Neutral Player
        </button>
        <button type="button" onClick={() => addObject('ball')}>
          Add Ball
        </button>
        <button type="button" onClick={() => addObject('cone')}>
          Add Cone
        </button>
        <button type="button" onClick={() => addObject('arrow')}>
          Add Arrow / Line
        </button>
        <button type="button" onClick={() => addObject('area')}>
          Add Area / Zone
        </button>
        <button type="button" onClick={deleteSelectedObject} disabled={!selectedObjectId}>
          Delete Selected
        </button>
        <button type="button" onClick={clearDiagram}>
          Clear Diagram
        </button>
      </div>

      <svg
        className="diagram-pitch diagram-editor-pitch"
        onPointerLeave={stopDrag}
        onPointerMove={moveSelectedObject}
        onPointerUp={stopDrag}
        onPointerDown={() => setSelectedObjectId(null)}
        ref={svgRef}
        viewBox="0 0 100 60"
        role="img"
      >
        <defs>
          <marker
            id="editor-arrow-head"
            markerHeight="4"
            markerWidth="4"
            orient="auto"
            refX="3.5"
            refY="2"
          >
            <path d="M 0 0 L 4 2 L 0 4 Z" />
          </marker>
        </defs>
        <PitchLines />
        {workingDiagram.objects.map((object) => (
          <InteractiveDiagramObject
            key={object.id}
            object={object}
            onPointerDown={startDrag}
            selected={object.id === selectedObjectId}
          />
        ))}
      </svg>

      <label className="diagram-notes-field">
        Diagram notes
        <textarea rows="3" value={workingDiagram.notes} onChange={updateNotes} />
      </label>

      <div className="form-actions">
        <button className="primary-button" type="button" onClick={saveDiagram}>
          Save Diagram
        </button>
        <button className="secondary-button" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default DiagramEditor
