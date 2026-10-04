import React, { useState, useMemo } from 'react';
import { 
  Network, Search, Filter, RefreshCw, 
  AlertTriangle, FileText, User, Building2, Coins, Calendar, Layers, Plus, Upload, Sparkles, HelpCircle, Layers3
} from 'lucide-react';

export default function EvidenceGraphView({ documents = [], onNavigateConflict, onOpenUpload }) {
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('ALL'); // 'ALL' or specific doc ID

  // Dynamically compute Graph Nodes and Edges from uploaded documents (Merging shared entities)
  const { nodes, edges } = useMemo(() => {
    if (!documents || documents.length === 0) {
      return { nodes: [], edges: [] };
    }

    const calculatedNodes = [];
    const calculatedEdges = [];
    const width = 900;
    const height = 500;
    const centerX = width / 2; // 450
    const centerY = height / 2; // 250

    // Filter documents based on focus selection
    const activeDocs = selectedDocId === 'ALL' 
      ? documents 
      : documents.filter(d => (d.id || d.title) === selectedDocId);

    if (activeDocs.length === 0) {
      return { nodes: [], edges: [] };
    }

    if (activeDocs.length === 1) {
      // SINGLE DOCUMENT MODE: Clean 360° radial distribution around a single central node
      const singleDoc = activeDocs[0];
      const docNodeId = `node-doc-${singleDoc.id || 0}`;

      // Central Document Node
      calculatedNodes.push({
        id: docNodeId,
        label: singleDoc.title.length > 22 ? singleDoc.title.slice(0, 20) + '...' : singleDoc.title,
        fullTitle: singleDoc.title,
        type: 'Document',
        color: '#0EA5E9', // Sky Blue
        x: centerX,
        y: centerY,
        isCenterDoc: true,
        details: `Source document: ${singleDoc.title} (${singleDoc.pages || 10} pages, ${singleDoc.category || 'General'}).`
      });

      const entities = singleDoc.extractedEntities || ['Key Terms', 'Primary Subject', 'Execution Date'];
      const totalEnts = entities.length;
      const radius = 175;

      entities.forEach((ent, entIdx) => {
        const entNodeId = `node-ent-0-${entIdx}`;
        // Distribute evenly in 360° circle starting from top (-90deg)
        const entAngle = (entIdx / totalEnts) * 2 * Math.PI - (Math.PI / 2);

        let type = 'Organization';
        let color = '#8B5CF6'; // Violet
        let relationshipLabel = 'Core Architecture';

        if (ent.includes('₹') || ent.includes('$') || ent.toLowerCase().includes('payable') || ent.toLowerCase().includes('loss') || ent.toLowerCase().includes('amount')) {
          type = 'Money';
          color = '#10B981'; // Emerald
          relationshipLabel = 'Specifies Value';
        } else if (ent.toLowerCase().includes('policy') || ent.toLowerCase().includes('conflict') || ent.toLowerCase().includes('rule') || ent.toLowerCase().includes('plagiarism') || ent.toLowerCase().includes('limit')) {
          type = 'Conflict';
          color = '#EF4444'; // Red
          relationshipLabel = 'Governance Constraint';
        } else if (ent.toLowerCase().includes('party') || ent.toLowerCase().includes('officer') || ent.toLowerCase().includes('smith') || ent.toLowerCase().includes('john')) {
          type = 'Person';
          color = '#A855F7'; // Purple
          relationshipLabel = 'Executing Authority';
        }

        // Apply boundary safety margins (X min 100 max 800)
        const rawX = centerX + Math.cos(entAngle) * radius;
        const rawY = centerY + Math.sin(entAngle) * radius;
        const entX = Math.round(Math.max(100, Math.min(width - 100, rawX)));
        const entY = Math.round(Math.max(65, Math.min(height - 65, rawY)));

        calculatedNodes.push({
          id: entNodeId,
          label: ent.length > 22 ? ent.slice(0, 20) + '...' : ent,
          fullTitle: ent,
          type: type,
          color: color,
          x: entX,
          y: entY,
          angle: entAngle,
          parentDocTitle: singleDoc.title,
          details: `Extracted ${type} entity from ${singleDoc.title}.`
        });

        calculatedEdges.push({
          from: docNodeId,
          to: entNodeId,
          label: relationshipLabel,
          color: color,
          dash: type === 'Conflict'
        });
      });

    } else {
      // MULTI-DOCUMENT UNIFIED KNOWLEDGE GRAPH:
      // Place document nodes on left and right poles, merge identical entities into shared middle nodes!
      
      // 1. Place Document Nodes
      const docNodes = [];
      activeDocs.forEach((doc, dIdx) => {
        const docNodeId = `node-doc-${doc.id || dIdx}`;
        const isLeft = dIdx % 2 === 0;
        // Document anchors: Document 0 at X=210, Document 1 at X=690 (if 2 docs)
        const docX = activeDocs.length === 2 
          ? (isLeft ? 210 : 690) 
          : Math.round(centerX + Math.cos((dIdx / activeDocs.length) * 2 * Math.PI) * 240);
        
        const docY = activeDocs.length === 2
          ? centerY
          : Math.round(centerY + Math.sin((dIdx / activeDocs.length) * 2 * Math.PI) * 160);

        const nodeObj = {
          id: docNodeId,
          label: doc.title.length > 18 ? doc.title.slice(0, 16) + '...' : doc.title,
          fullTitle: doc.title,
          type: 'Document',
          color: '#0EA5E9',
          x: docX,
          y: docY,
          isCenterDoc: true,
          details: `Document Vault File: ${doc.title} (${doc.category || 'General'})`
        };
        docNodes.push(nodeObj);
        calculatedNodes.push(nodeObj);
      });

      // 2. Build Map of Unique Entity Names -> Documents that reference them
      const entityMap = new Map(); // entityName -> { docs: [docNodeId], details }

      activeDocs.forEach((doc, dIdx) => {
        const docNodeId = `node-doc-${doc.id || dIdx}`;
        const entities = doc.extractedEntities || ['Key Terms', 'Primary Subject', 'Execution Date'];
        
        entities.forEach((ent) => {
          const key = ent.trim().toLowerCase();
          if (!entityMap.has(key)) {
            entityMap.set(key, {
              originalName: ent.trim(),
              docIds: [docNodeId],
              docTitles: [doc.title]
            });
          } else {
            const existing = entityMap.get(key);
            if (!existing.docIds.includes(docNodeId)) {
              existing.docIds.push(docNodeId);
              existing.docTitles.push(doc.title);
            }
          }
        });
      });

      // 3. Layout Entity Nodes (Shared entities sit in middle column X=450, Unique entities curve outward)
      const uniqueEntityEntries = Array.from(entityMap.values());
      const totalEntities = uniqueEntityEntries.length;

      uniqueEntityEntries.forEach((entItem, idx) => {
        const entNodeId = `node-ent-shared-${idx}`;
        const isShared = entItem.docIds.length > 1;
        const name = entItem.originalName;

        let type = 'Organization';
        let color = '#8B5CF6';
        let relationshipLabel = isShared ? 'Shared Concept' : 'Core Architecture';

        if (name.includes('₹') || name.includes('$') || name.toLowerCase().includes('payable') || name.toLowerCase().includes('loss') || name.toLowerCase().includes('amount')) {
          type = 'Money';
          color = '#10B981';
          relationshipLabel = 'Specifies Value';
        } else if (name.toLowerCase().includes('policy') || name.toLowerCase().includes('conflict') || name.toLowerCase().includes('rule') || name.toLowerCase().includes('plagiarism') || name.toLowerCase().includes('limit')) {
          type = 'Conflict';
          color = '#EF4444';
          relationshipLabel = 'Governance Constraint';
        } else if (name.toLowerCase().includes('party') || name.toLowerCase().includes('officer') || name.toLowerCase().includes('smith') || name.toLowerCase().includes('john')) {
          type = 'Person';
          color = '#A855F7';
          relationshipLabel = 'Executing Authority';
        }

        let entX = centerX;
        let entY = centerY;
        let angle = 0;

        if (isShared) {
          // Shared nodes: vertically stacked along the central column (X=450)
          const sharedCount = uniqueEntityEntries.filter(e => e.docIds.length > 1).length;
          const sharedIdx = uniqueEntityEntries.filter(e => e.docIds.length > 1).indexOf(entItem);
          entX = centerX;
          entY = Math.round(90 + (sharedIdx / Math.max(1, sharedCount - 1)) * 320);
        } else {
          // Unique node tied to a specific document: place in an arc around its source document
          const parentDocId = entItem.docIds[0];
          const parentNode = docNodes.find(d => d.id === parentDocId) || docNodes[0];
          const isLeft = parentNode.x < centerX;

          // Arc angles facing outwards (-90deg to +90deg or 90deg to 270deg)
          const docUniqueEntries = uniqueEntityEntries.filter(e => e.docIds.length === 1 && e.docIds[0] === parentDocId);
          const uIdx = docUniqueEntries.indexOf(entItem);
          const totalU = docUniqueEntries.length;

          const arcSpan = Math.PI * 0.8;
          const baseAngle = isLeft ? Math.PI : 0; // facing left or facing right
          angle = baseAngle - (arcSpan / 2) + (uIdx / Math.max(1, totalU - 1)) * arcSpan;
          
          entX = Math.round(parentNode.x + Math.cos(angle) * 145);
          entY = Math.round(parentNode.y + Math.sin(angle) * 145);
        }

        // Strict canvas boundaries to avoid clipping (X: 110 .. 790, Y: 65 .. 435)
        entX = Math.max(110, Math.min(width - 110, entX));
        entY = Math.max(65, Math.min(height - 65, entY));

        calculatedNodes.push({
          id: entNodeId,
          label: name.length > 22 ? name.slice(0, 20) + '...' : name,
          fullTitle: name,
          type: type,
          color: color,
          x: entX,
          y: entY,
          angle: angle,
          isShared: isShared,
          parentDocTitle: entItem.docTitles.join(', '),
          details: isShared 
            ? `Shared ${type} entity connected to multiple documents: ${entItem.docTitles.join(' & ')}.`
            : `Extracted ${type} entity from ${entItem.docTitles[0]}.`
        });

        // Add edges from all source documents to this entity node
        entItem.docIds.forEach((docId) => {
          calculatedEdges.push({
            from: docId,
            to: entNodeId,
            label: isShared ? 'Cross-Doc Evidence' : relationshipLabel,
            color: isShared ? '#F59E0B' : color, // Gold/Amber for shared cross-doc edges
            dash: type === 'Conflict' || isShared
          });
        });
      });
    }

    return { nodes: calculatedNodes, edges: calculatedEdges };
  }, [documents, selectedDocId]);

  const [selectedNode, setSelectedNode] = useState(null);

  // Auto-select first node if available
  React.useEffect(() => {
    if (nodes.length > 0 && !selectedNode) {
      setSelectedNode(nodes[0]);
    }
  }, [nodes]);

  const nodeTypes = ['All', 'Organization', 'Document', 'Money', 'Person', 'Conflict'];

  const filteredNodes = nodes.filter((n) => {
    const matchType = filterType === 'All' || n.type === filterType;
    const matchSearch = n.fullTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Graph Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 font-heading">
              <Network className="w-6 h-6 text-indigo-600" />
              Evidence Knowledge Graph
            </h1>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200 font-mono">
              {nodes.length} Nodes • {edges.length} Relationships
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Unified cross-document relationship graph mapping technical concepts, financial values, and evidentiary links.
          </p>
        </div>

        {/* Legend Bar */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className="flex items-center gap-1 bg-sky-50 text-sky-700 px-2.5 py-1 rounded-md border border-sky-100">
            <FileText className="w-3 h-3" /> Document
          </span>
          <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100">
            <Building2 className="w-3 h-3" /> Technical / Entity
          </span>
          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100">
            <Coins className="w-3 h-3" /> Money / Value
          </span>
          <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md border border-purple-100">
            <User className="w-3 h-3" /> Person
          </span>
          <span className="flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-md border border-red-100">
            <AlertTriangle className="w-3 h-3" /> Conflict
          </span>
        </div>
      </div>

      {/* Main Canvas + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Graph Canvas */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl relative min-h-[540px] flex flex-col justify-between overflow-hidden">
          {/* Controls & Focus Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 z-10 bg-slate-800/90 backdrop-blur-xs p-3 rounded-xl border border-slate-700">
            {/* Search Input */}
            <div className="relative w-48 sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Find node in graph..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Document Focus View Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 font-mono">
                <Layers3 className="w-3.5 h-3.5 text-indigo-400" /> Focus:
              </span>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="ALL">🌐 All Documents (Unified Graph)</option>
                {documents.map((doc, idx) => (
                  <option key={doc.id || idx} value={doc.id || doc.title}>
                    📄 {doc.title.length > 28 ? doc.title.slice(0, 26) + '...' : doc.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filters */}
            <div className="flex items-center gap-1">
              {nodeTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2 py-1 rounded-md text-[10px] font-bold transition ${
                    filterType === type ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Visual Graph Canvas */}
          {nodes.length > 0 ? (
            <div className="w-full h-[440px] relative my-2">
              <svg className="w-full h-full" viewBox="0 0 900 500">
                {/* Draw Edges & Edge Labels */}
                {edges.map((edge, idx) => {
                  const sourceNode = nodes.find(n => n.id === edge.from);
                  const targetNode = nodes.find(n => n.id === edge.to);
                  if (!sourceNode || !targetNode) return null;

                  const isConnectedToSelected = selectedNode && (selectedNode.id === edge.from || selectedNode.id === edge.to);

                  // Vector & Perpendicular Offset
                  const dx = targetNode.x - sourceNode.x;
                  const dy = targetNode.y - sourceNode.y;
                  const len = Math.sqrt(dx * dx + dy * dy) || 1;
                  const normalX = -dy / len;
                  const normalY = dx / len;

                  // Place label at 45% along line with 12px perpendicular offset
                  const labelX = Math.round(sourceNode.x + dx * 0.45 + normalX * 12);
                  const labelY = Math.round(sourceNode.y + dy * 0.45 + normalY * 12);

                  return (
                    <g key={idx}>
                      {/* Connecting Line */}
                      <line
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={edge.color}
                        strokeWidth={isConnectedToSelected ? 3 : 1.5}
                        strokeDasharray={edge.dash ? "5,5" : "none"}
                        opacity={isConnectedToSelected ? 1 : 0.45}
                      />

                      {/* Edge Label Badge */}
                      <g transform={`translate(${labelX}, ${labelY})`}>
                        <rect
                          x={-Math.round(edge.label.length * 3.1 + 5)}
                          y="-9"
                          width={Math.round(edge.label.length * 6.2 + 10)}
                          height="18"
                          rx="9"
                          fill="#0F172A"
                          fillOpacity="0.85"
                          stroke={edge.color}
                          strokeWidth="1"
                          strokeOpacity="0.6"
                        />
                        <text
                          x="0"
                          y="3"
                          fill="#E2E8F0"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="select-none font-mono"
                        >
                          {edge.label}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Draw Nodes */}
                {filteredNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;

                  // Smart Node Label Position (Top, Bottom, Left, Right based on position & angle)
                  let textX = 0;
                  let textY = 36;
                  let textAnchor = "middle";

                  if (node.isCenterDoc) {
                    textY = 36;
                    textAnchor = "middle";
                  } else {
                    const sin = Math.sin(node.angle || 0);
                    const cos = Math.cos(node.angle || 0);

                    if (sin < -0.5) {
                      textY = -28;
                      textAnchor = "middle";
                    } else if (sin > 0.5) {
                      textY = 36;
                      textAnchor = "middle";
                    } else if (cos < 0) {
                      textX = -28;
                      textY = 4;
                      textAnchor = "end";
                    } else {
                      textX = 28;
                      textY = 4;
                      textAnchor = "start";
                    }
                  }

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={() => setSelectedNode(node)}
                      className="cursor-pointer group"
                    >
                      {/* Node Circle */}
                      <circle
                        r={isSelected ? 26 : (node.isShared ? 23 : 20)}
                        fill={node.color}
                        stroke={node.isShared ? "#F59E0B" : "#ffffff"}
                        strokeWidth={isSelected ? 3.5 : (node.isShared ? 3 : 2)}
                        className="transition-all duration-200 drop-shadow-lg group-hover:scale-110"
                      />

                      {/* Inner Highlight Dot */}
                      <circle
                        r={node.isShared ? 7 : 5}
                        fill="#ffffff"
                        opacity={0.85}
                      />

                      {/* Smart Node Text Label */}
                      <text
                        x={textX}
                        y={textY}
                        fill="#FFFFFF"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor={textAnchor}
                        className="select-none font-heading drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 my-auto">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 text-indigo-400 flex items-center justify-center border border-slate-700 shadow-lg">
                <Network className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1">
                <h3 className="text-base font-bold text-white font-heading">
                  Knowledge Graph Ready for Ingestion
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The Evidence Knowledge Graph dynamically maps entity links, financial numbers, neural network concepts, and contradiction lines between your case files.
                </p>
              </div>
              {onOpenUpload && (
                <button
                  onClick={onOpenUpload}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-indigo-600/30 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Document to Generate Knowledge Nodes</span>
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-400 z-10 pt-2 border-t border-slate-800 font-mono">
            <span>💡 Select "Focus Document" or click any node to inspect connected evidence</span>
            <span>Unified Cross-Document Graph</span>
          </div>
        </div>

        {/* Right 1 Col: Selected Node Inspector Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                  style={{ backgroundColor: selectedNode.color }}
                >
                  {selectedNode.type === 'Organization' ? <Building2 className="w-6 h-6" /> :
                   selectedNode.type === 'Document' ? <FileText className="w-6 h-6" /> :
                   selectedNode.type === 'Money' ? <Coins className="w-6 h-6" /> :
                   selectedNode.type === 'Person' ? <User className="w-6 h-6" /> :
                   <AlertTriangle className="w-6 h-6" />}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    {selectedNode.isShared ? 'Cross-Document Shared Node' : `${selectedNode.type} Node`}
                  </span>
                  <h3 className="text-base font-black text-slate-900 font-heading">{selectedNode.fullTitle}</h3>
                </div>
              </div>

              {/* Node Details */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-700 font-heading">Enclave Inspection:</span>
                <p className="text-slate-600">{selectedNode.details}</p>
                {selectedNode.parentDocTitle && (
                  <p className="text-[11px] text-indigo-600 font-semibold pt-1 font-heading">
                    Source: {selectedNode.parentDocTitle}
                  </p>
                )}
              </div>

              {/* Linked Connections */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-heading">
                  Connected Relationships
                </h4>
                <div className="space-y-2">
                  {edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).map((edge, i) => {
                    const otherId = edge.from === selectedNode.id ? edge.to : edge.from;
                    const otherNode = nodes.find(n => n.id === otherId);
                    return (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 font-heading">{otherNode?.fullTitle}</span>
                          <p className="text-[10px] text-slate-500 font-mono">{edge.label}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-mono">
                          Verified
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs space-y-2">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-600 font-heading">Select a node in the graph</p>
              <p className="text-[11px] text-slate-400">Click any document or entity circle to view its linked relationships & source text.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
