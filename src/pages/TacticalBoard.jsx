import { useEffect, useMemo, useRef, useState } from 'react'
import {
  DiagramObject,
  getObjectLabel,
  getObjectTypeLabel,
  normaliseDiagram,
  pitchLayouts,
  PitchLines,
} from '../components/DiagramPreview.jsx'

const boardTypes = [
  'Training drill',
  'Formation',
  'Match tactic',
  'Set piece',
  'Opposition analysis',
  'Pressing shape',
  'Build-up pattern',
  'Defensive shape',
  'Free drawing',
]

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function createBoardObjectId(type) {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }

  return `${type}-${Date.now()}`
}

function createEmptyBoard() {
  return {
    id: null,
    title: '',
    boardType: 'Training drill',
    pitchLayout: 'fullPitch',
    notes: '',
    objects: [],
    createdAt: '',
    updatedAt: '',
  }
}

function getPointFromEvent(event, svgElement) {
  const rect = svgElement.getBoundingClientRect()

  return {
    x: clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100),
    y: clamp(((event.clientY - rect.top) / rect.height) * 60, 0, 60),
  }
}

function getPlayerPrefix(type) {
  return {
    homePlayer: 'H',
    awayPlayer: 'A',
    neutralPlayer: 'N',
  }[type]
}

function getNextPlayerNumber(type, objects) {
  const numbers = objects
    .filter((object) => object.type === type)
    .map((object) => Number(object.number || String(object.label || '').replace(/\D/g, '')))
    .filter((number) => Number.isFinite(number))

  return numbers.length > 0 ? Math.max(...numbers) + 1 : 1
}

function createDiagramObject(type, objects) {
  const baseX = clamp(18 + objects.length * 4, 6, 82)
  const baseY = clamp(18 + objects.length * 3, 6, 50)
  const baseObject = {
    id: createBoardObjectId(type),
    type,
    x: baseX,
    y: baseY,
  }

  if (type === 'homePlayer' || type === 'awayPlayer' || type === 'neutralPlayer') {
    const number = getNextPlayerNumber(type, objects)
    const prefix = getPlayerPrefix(type)

    return {
      ...baseObject,
      number: String(number),
      label: `${prefix}${number}`,
      size: 4.2,
    }
  }

  if (type === 'ball') {
    return { ...baseObject, size: 3.2 }
  }

  if (type === 'cone') {
    return { ...baseObject, size: 4.2 }
  }

  if (type === 'miniGoal') {
    return { ...baseObject, size: 11, rotation: 0 }
  }

  if (type === 'area') {
    return { ...baseObject, width: 24, height: 14, label: '' }
  }

  if (type === 'arrow' || type === 'line') {
    return {
      id: createBoardObjectId(type),
      type,
      startX: baseX,
      startY: baseY,
      endX: clamp(baseX + 18, 4, 96),
      endY: clamp(baseY - 8, 4, 56),
      lineStyle: 'solid',
      colour: '#101820',
      width: 1.2,
    }
  }

  return baseObject
}

function getLineGeometry(object) {
  const dx = object.endX - object.startX
  const dy = object.endY - object.startY
  const length = Math.max(Math.sqrt(dx * dx + dy * dy), 2)
  const angle = Math.atan2(dy, dx)
  const centerX = (object.startX + object.endX) / 2
  const centerY = (object.startY + object.endY) / 2

  return { angle, centerX, centerY, length }
}

function transformLine(object, options) {
  const { angle, centerX, centerY, length } = getLineGeometry(object)
  const nextAngle = angle + ((options.rotateDegrees || 0) * Math.PI) / 180
  const nextLength = clamp(length + (options.lengthDelta || 0), 4, 80)
  const dx = Math.cos(nextAngle) * nextLength * 0.5
  const dy = Math.sin(nextAngle) * nextLength * 0.5

  return {
    ...object,
    startX: clamp(centerX - dx, 0, 100),
    startY: clamp(centerY - dy, 0, 60),
    endX: clamp(centerX + dx, 0, 100),
    endY: clamp(centerY + dy, 0, 60),
  }
}

function normaliseBoard(board, index = 0) {
  const safeDiagram = normaliseDiagram(
    {
      notes: board?.notes || '',
      objects: board?.objects || [],
      pitchLayout: board?.pitchLayout || 'fullPitch',
      title: board?.title || 'Tactical board',
    },
    board?.title || 'Tactical board',
  )

  return {
    ...createEmptyBoard(),
    ...(board || {}),
    id: board?.id || `board-${index}`,
    title: board?.title || '',
    boardType: board?.boardType || 'Training drill',
    pitchLayout: safeDiagram.pitchLayout,
    notes: safeDiagram.notes || '',
    objects: safeDiagram.objects,
    createdAt: board?.createdAt || '',
    updatedAt: board?.updatedAt || board?.createdAt || '',
  }
}

function getBoardSortTime(board) {
  const time = new Date(board.updatedAt || board.createdAt || 0).getTime()
  return Number.isNaN(time) ? 0 : time
}

function sortBoardsByUpdatedAt(boards) {
  return boards
    .map((board, index) => ({ ...normaliseBoard(board, index), listIndex: index }))
    .sort((firstBoard, secondBoard) => {
      const timeDifference = getBoardSortTime(secondBoard) - getBoardSortTime(firstBoard)
      return timeDifference || firstBoard.listIndex - secondBoard.listIndex
    })
}

function getLayoutLabel(value) {
  return pitchLayouts.find((layout) => layout.value === value)?.label || 'Full pitch'
}

function formatBoardDate(value) {
  if (!value) {
    return 'Not saved yet'
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Not saved yet' : date.toLocaleDateString()
}

function TacticalBoard({
  activeBoardId,
  boards,
  notice,
  onAddBoard,
  onClearNotice,
  onDeleteBoard,
  onDuplicateBoard,
  onSelectBoard,
  onUpdateBoard,
}) {
  const [currentBoard, setCurrentBoard] = useState(createEmptyBoard)
  const [selectedObjectId, setSelectedObjectId] = useState(null)
  const [message, setMessage] = useState('')
  const [isPresenting, setIsPresenting] = useState(false)
  const svgRef = useRef(null)
  const dragRef = useRef(null)
  const sortedBoards = useMemo(() => sortBoardsByUpdatedAt(boards), [boards])
  const selectedObject = currentBoard.objects.find((object) => object.id === selectedObjectId)

  useEffect(() => {
    const selectedBoard = boards.find((board) => board.id === activeBoardId)

    if (selectedBoard) {
      setCurrentBoard(normaliseBoard(selectedBoard))
      setSelectedObjectId(null)
      setMessage('')
      return
    }

    if (!activeBoardId && boards.length === 0) {
      setCurrentBoard(createEmptyBoard())
      setSelectedObjectId(null)
    }
  }, [activeBoardId, boards])

  useEffect(() => {
    if (!notice) {
      return
    }

    setMessage(notice)
    onClearNotice()
  }, [notice, onClearNotice])

  const safeDiagram = normaliseDiagram(
    {
      title: currentBoard.title || 'Tactical board',
      notes: currentBoard.notes,
      pitchLayout: currentBoard.pitchLayout,
      objects: currentBoard.objects,
    },
    currentBoard.title || 'Tactical board',
  )

  function updateBoardField(fieldName, value) {
    setCurrentBoard((board) => ({ ...board, [fieldName]: value }))
  }

  function updateBoardObjects(updater) {
    setCurrentBoard((board) => ({
      ...board,
      objects: updater(board.objects),
    }))
  }

  function addObject(type) {
    updateBoardObjects((objects) => {
      const nextObject = createDiagramObject(type, objects)
      setSelectedObjectId(nextObject.id)
      return [...objects, nextObject]
    })
  }

  function updateSelectedObject(updater) {
    if (!selectedObjectId) {
      return
    }

    updateBoardObjects((objects) =>
      objects.map((object) => (object.id === selectedObjectId ? updater(object) : object)),
    )
  }

  function deleteSelectedObject() {
    if (!selectedObjectId) {
      return
    }

    updateBoardObjects((objects) => objects.filter((object) => object.id !== selectedObjectId))
    setSelectedObjectId(null)
  }

  function duplicateSelectedObject() {
    if (!selectedObject) {
      return
    }

    const duplicate = {
      ...selectedObject,
      id: createBoardObjectId(selectedObject.type),
    }

    if (duplicate.type === 'arrow' || duplicate.type === 'line') {
      duplicate.startX = clamp(duplicate.startX + 4, 0, 100)
      duplicate.startY = clamp(duplicate.startY + 4, 0, 60)
      duplicate.endX = clamp(duplicate.endX + 4, 0, 100)
      duplicate.endY = clamp(duplicate.endY + 4, 0, 60)
    } else {
      duplicate.x = clamp(duplicate.x + 4, 0, 96)
      duplicate.y = clamp(duplicate.y + 4, 0, 56)
    }

    updateBoardObjects((objects) => [...objects, duplicate])
    setSelectedObjectId(duplicate.id)
  }

  function startNewBoard() {
    setCurrentBoard(createEmptyBoard())
    setSelectedObjectId(null)
    onSelectBoard(null)
    setMessage('New tactical board ready.')
  }

  function selectBoard(boardId) {
    const board = boards.find((savedBoard) => savedBoard.id === boardId)

    if (!board) {
      return
    }

    onSelectBoard(boardId)
    setCurrentBoard(normaliseBoard(board))
    setSelectedObjectId(null)
    setMessage('')
  }

  function saveBoard() {
    const title = currentBoard.title.trim()

    if (!title) {
      setMessage('Please add a board title before saving.')
      return
    }

    const boardToSave = {
      ...currentBoard,
      title,
      boardType: currentBoard.boardType || 'Training drill',
      pitchLayout: currentBoard.pitchLayout || 'fullPitch',
      notes: currentBoard.notes.trim(),
      objects: safeDiagram.objects,
    }

    if (currentBoard.id && boards.some((board) => board.id === currentBoard.id)) {
      onUpdateBoard(currentBoard.id, boardToSave)
      setMessage('Tactical board updated and saved locally.')
      return
    }

    const newBoardId = onAddBoard(boardToSave)
    setCurrentBoard((board) => ({ ...board, id: newBoardId }))
    setMessage('Tactical board created and saved locally.')
  }

  function duplicateBoard() {
    if (!currentBoard.id) {
      setMessage('Save the board before duplicating it.')
      return
    }

    const duplicateId = onDuplicateBoard(currentBoard.id)

    if (duplicateId) {
      const duplicatedBoard = boards.find((board) => board.id === currentBoard.id)
      setCurrentBoard(
        normaliseBoard({
          ...duplicatedBoard,
          id: duplicateId,
          title: `${currentBoard.title || duplicatedBoard?.title || 'Tactical board'} copy`,
        }),
      )
      setSelectedObjectId(null)
      setMessage('Tactical board duplicated.')
    }
  }

  function deleteBoard() {
    if (!currentBoard.id) {
      startNewBoard()
      return
    }

    const shouldDelete = window.confirm(`Delete ${currentBoard.title || 'this tactical board'}?`)

    if (!shouldDelete) {
      return
    }

    onDeleteBoard(currentBoard.id)
    setCurrentBoard(createEmptyBoard())
    setSelectedObjectId(null)
    setMessage('Tactical board deleted.')
  }

  function clearBoard() {
    setCurrentBoard((board) => ({ ...board, objects: [] }))
    setSelectedObjectId(null)
    setMessage('Current board cleared. Save Board to keep this change.')
  }

  function startDrag(event, objectId, mode = 'move') {
    event.preventDefault()
    event.stopPropagation()

    const svgElement = svgRef.current
    const selectedDiagramObject = currentBoard.objects.find((object) => object.id === objectId)

    if (!svgElement || !selectedDiagramObject) {
      return
    }

    const point = getPointFromEvent(event, svgElement)
    setSelectedObjectId(objectId)

    if ((selectedDiagramObject.type === 'arrow' || selectedDiagramObject.type === 'line') && mode === 'move') {
      dragRef.current = {
        mode,
        objectId,
        offsetX: point.x - selectedDiagramObject.startX,
        offsetY: point.y - selectedDiagramObject.startY,
        lineDx: selectedDiagramObject.endX - selectedDiagramObject.startX,
        lineDy: selectedDiagramObject.endY - selectedDiagramObject.startY,
      }
    } else if (mode === 'start' || mode === 'end') {
      dragRef.current = { mode, objectId }
    } else {
      dragRef.current = {
        mode,
        objectId,
        offsetX: point.x - selectedDiagramObject.x,
        offsetY: point.y - selectedDiagramObject.y,
      }
    }

    svgElement.setPointerCapture(event.pointerId)
  }

  function moveSelectedObject(event) {
    if (!dragRef.current || !svgRef.current) {
      return
    }

    const point = getPointFromEvent(event, svgRef.current)
    const { lineDx, lineDy, mode, objectId, offsetX = 0, offsetY = 0 } = dragRef.current

    updateBoardObjects((objects) =>
      objects.map((object) => {
        if (object.id !== objectId) {
          return object
        }

        if ((object.type === 'arrow' || object.type === 'line') && mode === 'start') {
          return { ...object, startX: clamp(point.x, 0, 100), startY: clamp(point.y, 0, 60) }
        }

        if ((object.type === 'arrow' || object.type === 'line') && mode === 'end') {
          return { ...object, endX: clamp(point.x, 0, 100), endY: clamp(point.y, 0, 60) }
        }

        if (object.type === 'arrow' || object.type === 'line') {
          const nextStartX = clamp(point.x - offsetX, 0, 100)
          const nextStartY = clamp(point.y - offsetY, 0, 60)

          return {
            ...object,
            startX: nextStartX,
            startY: nextStartY,
            endX: clamp(nextStartX + lineDx, 0, 100),
            endY: clamp(nextStartY + lineDy, 0, 60),
          }
        }

        const maxX = object.type === 'area' ? 98 - (object.width || 24) : 98
        const maxY = object.type === 'area' ? 58 - (object.height || 14) : 58

        return {
          ...object,
          x: clamp(point.x - offsetX, 2, maxX),
          y: clamp(point.y - offsetY, 2, maxY),
        }
      }),
    )
  }

  function stopDrag() {
    dragRef.current = null
  }

  function changeSize(delta) {
    updateSelectedObject((object) => ({ ...object, size: clamp((object.size || 4) + delta, 1.5, 22) }))
  }

  function resizeArea(widthDelta, heightDelta) {
    updateSelectedObject((object) => ({
      ...object,
      width: clamp((object.width || 24) + widthDelta, 6, 80),
      height: clamp((object.height || 14) + heightDelta, 5, 50),
    }))
  }

  function rotateMiniGoal(degrees) {
    updateSelectedObject((object) => ({
      ...object,
      rotation: (((object.rotation || 0) + degrees) % 360 + 360) % 360,
    }))
  }

  function changePlayerNumber(event) {
    const number = event.target.value

    updateSelectedObject((object) => ({
      ...object,
      number,
      label: `${getPlayerPrefix(object.type)}${number}`,
    }))
  }

  function changePlayerType(event) {
    const nextType = event.target.value

    updateSelectedObject((object) => ({
      ...object,
      type: nextType,
      label: `${getPlayerPrefix(nextType)}${object.number || '1'}`,
    }))
  }

  function toggleLineStyle() {
    updateSelectedObject((object) => ({
      ...object,
      lineStyle: object.lineStyle === 'dashed' ? 'solid' : 'dashed',
    }))
  }

  if (isPresenting) {
    return (
      <section className="tactical-presentation-mode">
        <div className="tactical-presentation-header">
          <div>
            <p className="section-kicker">Presentation Mode</p>
            <h3>{currentBoard.title || 'Untitled tactical board'}</h3>
            {currentBoard.notes && <p>{currentBoard.notes}</p>}
          </div>
          <button className="secondary-button" type="button" onClick={() => setIsPresenting(false)}>
            Exit Presentation Mode
          </button>
        </div>

        <svg className="diagram-pitch tactical-presentation-pitch" viewBox="0 0 100 60" role="img">
          <defs>
            <marker id="diagram-arrow-head" markerHeight="4" markerWidth="4" orient="auto" refX="3.5" refY="2">
              <path d="M 0 0 L 4 2 L 0 4 Z" />
            </marker>
          </defs>
          <PitchLines layout={safeDiagram.pitchLayout} />
          {safeDiagram.objects.map((object) => (
            <DiagramObject key={object.id} object={object} selected={false} />
          ))}
        </svg>
      </section>
    )
  }

  return (
    <section className="tactical-board-page">
      <div className="tactical-workstation-toolbar">
        <label>
          Board title
          <input
            onChange={(event) => updateBoardField('title', event.target.value)}
            placeholder="5v3 Overload Possession"
            value={currentBoard.title}
          />
        </label>
        <label>
          Board type
          <select
            onChange={(event) => updateBoardField('boardType', event.target.value)}
            value={currentBoard.boardType}
          >
            {boardTypes.map((boardType) => (
              <option key={boardType}>{boardType}</option>
            ))}
          </select>
        </label>
        <label>
          Pitch layout
          <select
            onChange={(event) => updateBoardField('pitchLayout', event.target.value)}
            value={currentBoard.pitchLayout}
          >
            {pitchLayouts.map((layout) => (
              <option key={layout.value} value={layout.value}>
                {layout.label}
              </option>
            ))}
          </select>
        </label>
        <div className="tactical-board-actions">
          <button className="secondary-button" type="button" onClick={startNewBoard}>
            New Board
          </button>
          <button className="primary-button" type="button" onClick={saveBoard}>
            Save Board
          </button>
          <button className="secondary-button" disabled={!currentBoard.id} type="button" onClick={duplicateBoard}>
            Duplicate Board
          </button>
          <button className="danger-button" type="button" onClick={deleteBoard}>
            Delete Board
          </button>
          <button className="secondary-button" type="button" onClick={clearBoard}>
            Clear Board
          </button>
          <button className="secondary-button" type="button" onClick={() => setIsPresenting(true)}>
            Presentation Mode
          </button>
        </div>
      </div>

      {message && <p className="form-message tactical-message">{message}</p>}

      <div className="tactical-workstation-layout">
        <aside className="tactical-saved-panel">
          <div className="panel-heading">
            <span>Saved boards</span>
            <strong>{boards.length}</strong>
          </div>
          <button className="primary-button tactical-new-board-button" type="button" onClick={startNewBoard}>
            New Board
          </button>

          {sortedBoards.length === 0 ? (
            <p className="empty-message">No tactical boards saved yet.</p>
          ) : (
            <div className="tactical-board-list">
              {sortedBoards.map((board) => (
                <button
                  className={board.id === currentBoard.id ? 'tactical-board-list-item active' : 'tactical-board-list-item'}
                  key={board.id}
                  onClick={() => selectBoard(board.id)}
                  type="button"
                >
                  <strong>{board.title || 'Untitled board'}</strong>
                  <small>{board.boardType}</small>
                  <span>{getLayoutLabel(board.pitchLayout)}</span>
                  <small>Updated {formatBoardDate(board.updatedAt || board.createdAt)}</small>
                </button>
              ))}
            </div>
          )}
        </aside>

        <main className="tactical-centre-panel">
          <div className="tactical-object-toolbar" aria-label="Tactical board object tools">
            <button type="button" onClick={() => addObject('homePlayer')}>Add Home Player</button>
            <button type="button" onClick={() => addObject('awayPlayer')}>Add Away Player</button>
            <button type="button" onClick={() => addObject('neutralPlayer')}>Add Neutral Player</button>
            <button type="button" onClick={() => addObject('ball')}>Add Ball</button>
            <button type="button" onClick={() => addObject('cone')}>Add Cone</button>
            <button type="button" onClick={() => addObject('miniGoal')}>Add Mini Goal</button>
            <button type="button" onClick={() => addObject('arrow')}>Add Arrow</button>
            <button type="button" onClick={() => addObject('line')}>Add Line</button>
            <button type="button" onClick={() => addObject('area')}>Add Area / Zone</button>
          </div>

          <svg
            className="diagram-pitch tactical-board-pitch"
            onPointerDown={() => setSelectedObjectId(null)}
            onPointerLeave={stopDrag}
            onPointerMove={moveSelectedObject}
            onPointerUp={stopDrag}
            ref={svgRef}
            role="img"
            viewBox="0 0 100 60"
          >
            <defs>
              <marker id="diagram-arrow-head" markerHeight="4" markerWidth="4" orient="auto" refX="3.5" refY="2">
                <path d="M 0 0 L 4 2 L 0 4 Z" />
              </marker>
            </defs>
            <PitchLines layout={safeDiagram.pitchLayout} />
            {safeDiagram.objects.map((object) => (
              <DiagramObject
                key={object.id}
                object={object}
                onHandlePointerDown={startDrag}
                onPointerDown={startDrag}
                selected={object.id === selectedObjectId}
                showHandles
              />
            ))}
          </svg>
        </main>

        <aside className="tactical-inspector-panel">
          <SelectedObjectControls
            object={selectedObject}
            onChangeNumber={changePlayerNumber}
            onChangePlayerType={changePlayerType}
            onDelete={deleteSelectedObject}
            onDuplicate={duplicateSelectedObject}
            onLineLength={(delta) => updateSelectedObject((object) => transformLine(object, { lengthDelta: delta }))}
            onLineRotate={(degrees) => updateSelectedObject((object) => transformLine(object, { rotateDegrees: degrees }))}
            onResizeArea={resizeArea}
            onRotateGoalLeft={() => rotateMiniGoal(-90)}
            onRotateGoalRight={() => rotateMiniGoal(90)}
            onSizeChange={changeSize}
            onToggleLineStyle={toggleLineStyle}
          />

          <label className="tactical-notes-field">
            Board notes
            <textarea
              onChange={(event) => updateBoardField('notes', event.target.value)}
              rows="8"
              value={currentBoard.notes}
            />
          </label>
        </aside>
      </div>
    </section>
  )
}

function SelectedObjectControls({
  object,
  onChangeNumber,
  onChangePlayerType,
  onDelete,
  onDuplicate,
  onLineLength,
  onLineRotate,
  onResizeArea,
  onRotateGoalLeft,
  onRotateGoalRight,
  onSizeChange,
  onToggleLineStyle,
}) {
  if (!object) {
    return (
      <section className="selected-object-panel muted">
        <p className="section-kicker">Selected Object Controls</p>
        <p>Select an object on the pitch to edit it.</p>
      </section>
    )
  }

  const isPlayer = object.type === 'homePlayer' || object.type === 'awayPlayer' || object.type === 'neutralPlayer'
  const canResize = isPlayer || object.type === 'ball' || object.type === 'cone' || object.type === 'miniGoal'
  const isLine = object.type === 'arrow' || object.type === 'line'

  return (
    <section className="selected-object-panel">
      <div>
        <p className="section-kicker">Selected Object Controls</p>
        <h4>{getObjectTypeLabel(object)}</h4>
        <p>{getObjectLabel(object)}</p>
      </div>

      {isPlayer && (
        <div className="selected-control-grid">
          <label>
            Number
            <input value={object.number || ''} onChange={onChangeNumber} />
          </label>
          <label>
            Player type
            <select value={object.type} onChange={onChangePlayerType}>
              <option value="homePlayer">Home</option>
              <option value="awayPlayer">Away</option>
              <option value="neutralPlayer">Neutral</option>
            </select>
          </label>
        </div>
      )}

      <div className="selected-control-buttons">
        {canResize && (
          <>
            <button type="button" onClick={() => onSizeChange(-0.8)}>Size -</button>
            <button type="button" onClick={() => onSizeChange(0.8)}>Size +</button>
          </>
        )}

        {object.type === 'miniGoal' && (
          <>
            <button type="button" onClick={onRotateGoalLeft}>Rotate Left</button>
            <button type="button" onClick={onRotateGoalRight}>Rotate Right</button>
          </>
        )}

        {isLine && (
          <>
            <button type="button" onClick={onToggleLineStyle}>
              {object.lineStyle === 'dashed' ? 'Solid line' : 'Dashed line'}
            </button>
            <button type="button" onClick={() => onLineRotate(-15)}>Rotate Left</button>
            <button type="button" onClick={() => onLineRotate(15)}>Rotate Right</button>
            <button type="button" onClick={() => onLineLength(-5)}>Length -</button>
            <button type="button" onClick={() => onLineLength(5)}>Length +</button>
          </>
        )}

        {object.type === 'area' && (
          <>
            <button type="button" onClick={() => onResizeArea(5, 0)}>Wider</button>
            <button type="button" onClick={() => onResizeArea(-5, 0)}>Narrower</button>
            <button type="button" onClick={() => onResizeArea(0, 4)}>Taller</button>
            <button type="button" onClick={() => onResizeArea(0, -4)}>Shorter</button>
          </>
        )}

        <button type="button" onClick={onDuplicate}>Duplicate Selected</button>
        <button type="button" onClick={onDelete}>Delete Selected</button>
      </div>
    </section>
  )
}

export default TacticalBoard
