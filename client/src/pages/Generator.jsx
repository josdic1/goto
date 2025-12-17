// Generator.jsx - FULLY FIXED VERSION
import { useState } from "react";
import { Code, Database, ArrowLeft, Copy, Plus, Trash2, Settings, HelpCircle } from "lucide-react";

export function Generator() {
  const [tables, setTables] = useState([]);
  const [showCode, setShowCode] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionnaireHistory, setQuestionnaireHistory] = useState([]);
  const [questionnaireData, setQuestionnaireData] = useState({
    table1: "",
    table2: "",
    answers: {},
  });

  const [generatedCode, setGeneratedCode] = useState({
    models: "",
    serializers: "",
    routes: "",
  });

  const [options, setOptions] = useState({
    serializer: "marshmallow",
    routing: "flask-restful",
    addDocstrings: true,
    addRouteDocstrings: true,
    autoBackPopulates: true,
    addPagination: true,
    defaultPageSize: 20,
    useAssociationProxy: false,
    cascadeDelete: true, // NEW: Add cascade delete by default
  });

  const updateOption = (key, value) => {
    setOptions({ ...options, [key]: value });
  };

  const pluralize = (word) => {
    if (!word) return word;
    const lower = word.toLowerCase();

    const irregulars = {
      person: "people",
      child: "children",
      mouse: "mice",
      category: "categories",
      status: "statuses",
      analysis: "analyses",
      basis: "bases",
      crisis: "crises",
      datum: "data",
      medium: "media",
      quiz: "quizzes",
      ox: "oxen",
      foot: "feet",
      tooth: "teeth",
      goose: "geese",
    };

    if (irregulars[lower]) return irregulars[lower];
    if (lower.match(/[^aeiou]y$/)) return lower.slice(0, -1) + "ies";
    if (lower.match(/(s|ss|sh|ch|x|z)$/)) return lower + "es";
    if (lower.match(/[^aeiou]o$/)) return lower + "es";
    if (lower.match(/(f|fe)$/)) return lower.replace(/(f|fe)$/, "ves");
    return lower + "s";
  };

  // QUESTIONNAIRE LOGIC START --------------------------------------------------------------------------------------------------
  const startQuestionnaire = () => {
    setQuestionnaireData({
      table1: "",
      table2: "",
      answers: {},
    });
    setCurrentQuestion(0);
    setQuestionnaireHistory([]);
    setShowQuestionnaire(true);
  };

  // Fixed and clarified questions
  const questions = [
    {
      id: "table_names",
      question: "Step 1: What two tables are we connecting?",
      type: "input",
      fields: ["table1", "table2"],
      placeholder: ["user", "post"],
    },
    {
      id: "cardinality_a_to_b",
      question: (data) => `Q1: How many ${pluralize(data.table2)} can ONE ${data.table1} have?`,
      type: "choice",
      choices: (data) => [
        { value: "one", label: `ONE ${data.table2}` },
        { value: "many", label: `MANY ${pluralize(data.table2)}` },
      ],
      explanation: (data) => `Think: Can one ${data.table1} be linked to multiple ${pluralize(data.table2)}?`,
    },
    {
      id: "cardinality_b_to_a",
      question: (data) => `Q2: How many ${pluralize(data.table1)} can ONE ${data.table2} belong to?`,
      type: "choice",
      choices: (data) => [
        { value: "one", label: `ONE ${data.table1}` },
        { value: "many", label: `MANY ${pluralize(data.table1)}` },
      ],
      explanation: (data) => `Think: Can one ${data.table2} be linked to multiple ${pluralize(data.table1)}?`,
    },
    {
      id: "dependency",
      question: (data) => {
        // Determine which table gets the FK
        const aToB = data.answers.cardinality_a_to_b;
        const bToA = data.answers.cardinality_b_to_a;
        
        if (aToB === "many" && bToA === "one") {
          // 1:M (A->B), FK on B
          return `Q3: Can a ${data.table2} exist without being linked to a ${data.table1}?`;
        } else if (aToB === "one" && bToA === "one") {
          // 1:1 (A->B), FK on B
          return `Q3: Can a ${data.table2} exist without being linked to a ${data.table1}?`;
        } else if (aToB === "one" && bToA === "many") {
          // M:1 (B->A), FK on A
          return `Q3: Can a ${data.table1} exist without being linked to a ${data.table2}?`;
        }
        return "Q3: Is this relationship required?";
      },
      type: "boolean",
      explanation: (data) => {
        const aToB = data.answers.cardinality_a_to_b;
        const bToA = data.answers.cardinality_b_to_a;
        
        if (aToB === "many" && bToA === "one") {
          return `If NO, then ${data.table2}.${data.table1}_id will be required (nullable=False)`;
        } else if (aToB === "one" && bToA === "one") {
          return `If NO, then ${data.table2}.${data.table1}_id will be required (nullable=False)`;
        } else if (aToB === "one" && bToA === "many") {
          return `If NO, then ${data.table1}.${data.table2}_id will be required (nullable=False)`;
        }
        return "";
      },
      showIf: (data) => {
        const aToB = data.answers.cardinality_a_to_b;
        const bToA = data.answers.cardinality_b_to_a;
        // Show when there's a FK (not M:M)
        return !(aToB === "many" && bToA === "many");
      }
    },
  ];

  const handleQuestionnaireAnswer = (value) => {
    const question = questions[currentQuestion];
    let updatedData = { ...questionnaireData };

    if (question.id === "table_names") {
      const t1 = value.table1.trim().toLowerCase();
      const t2 = value.table2.trim().toLowerCase();
      
      if (!t1 || !t2) {
        alert("Please enter both table names");
        return;
      }
      
      if (t1 === t2) {
        alert("Table names must be different");
        return;
      }
      
      updatedData.table1 = t1;
      updatedData.table2 = t2;
    } else {
      updatedData.answers = {
        ...updatedData.answers,
        [question.id]: value,
      };
    }

    setQuestionnaireData(updatedData);
    setQuestionnaireHistory([...questionnaireHistory, currentQuestion]);

    let nextQuestion = currentQuestion + 1;

    // Skip questions not relevant based on showIf logic
    while (nextQuestion < questions.length) {
      const nextQ = questions[nextQuestion];
      if (nextQ.showIf && !nextQ.showIf(updatedData)) {
        nextQuestion++;
      } else {
        break;
      }
    }

    if (nextQuestion >= questions.length) {
      analyzeQuestionnaireResults(updatedData);
    } else {
      setCurrentQuestion(nextQuestion);
    }
  };

  const handleQuestionnairePrevious = () => {
    if (questionnaireHistory.length > 0) {
      const previousQuestion = questionnaireHistory[questionnaireHistory.length - 1];
      setQuestionnaireHistory(questionnaireHistory.slice(0, -1));
      setCurrentQuestion(previousQuestion);
    }
  };

  const analyzeQuestionnaireResults = (data) => {
    const { table1, table2, answers } = data;

    let recommendation = {
      table1OwnsMany: false, // 1:M, FK on B
      table1OwnsOne: false,  // 1:1, FK on B, unique=True
      manyToMany: false,     // M:M, Junction table
      table2OwnsMany: false, // M:1 (Reversed 1:M), FK on A
      nullable: answers.dependency === true, // TRUE means "can exist alone" so nullable=True
    };

    // Case M:M
    if (answers.cardinality_a_to_b === "many" && answers.cardinality_b_to_a === "many") {
      recommendation.manyToMany = true;
    } 
    // Case 1:M (A is owner)
    else if (answers.cardinality_a_to_b === "many" && answers.cardinality_b_to_a === "one") {
      recommendation.table1OwnsMany = true;
    } 
    // Case 1:1 (A is owner)
    else if (answers.cardinality_a_to_b === "one" && answers.cardinality_b_to_a === "one") {
      recommendation.table1OwnsOne = true;
    }
    // Case M:1 (B is owner)
    else if (answers.cardinality_a_to_b === "one" && answers.cardinality_b_to_a === "many") {
      recommendation.table2OwnsMany = true;
    }
    
    showQuestionnaireResults(recommendation);
  };

  const ResultsModal = ({ recommendation, onConfirm, onCancel }) => {
    const { table1, table2 } = questionnaireData;
    const table1Plural = pluralize(table1);
    const table2Plural = pluralize(table2);
    const isRequired = !recommendation.nullable;
    
    let type = '';
    let implementation = '';
    let dependency = '';

    if (recommendation.manyToMany) {
      const junction = [table1, table2].sort().join("_");
      type = "MANY-TO-MANY";
      implementation = `Junction table **${junction}** will be created`;
      dependency = "No foreign keys (uses junction table)";
    } else if (recommendation.table1OwnsMany) {
      type = "ONE-TO-MANY";
      implementation = `${table2} gets Foreign Key: **${table1}_id**`;
      dependency = `FK is ${isRequired ? '**REQUIRED** (nullable=False)' : '**OPTIONAL** (nullable=True)'}`;
    } else if (recommendation.table1OwnsOne) {
      type = "ONE-TO-ONE";
      implementation = `${table2} gets Foreign Key: **${table1}_id** (unique=True)`;
      dependency = `FK is ${isRequired ? '**REQUIRED** (nullable=False)' : '**OPTIONAL** (nullable=True)'}`;
    } else if (recommendation.table2OwnsMany) {
      type = "MANY-TO-ONE";
      implementation = `${table1} gets Foreign Key: **${table2}_id**`;
      dependency = `FK is ${isRequired ? '**REQUIRED** (nullable=False)' : '**OPTIONAL** (nullable=True)'}`;
    } else {
      type = "DISCONNECTED";
      implementation = "No connection will be created";
      dependency = "N/A";
    }

    return (
      <div className="questionnaire-modal">
        <div className="questionnaire-content results-modal">
          <h2>📋 Relationship Summary</h2>
          
          <div className="results-section">
            <h3>Connection Type</h3>
            <p className="result-value">{type}</p>
          </div>

          <div className="results-section">
            <h3>Tables</h3>
            <p className="result-value">
              <strong>{table1}</strong> ↔ <strong>{table2}</strong>
            </p>
          </div>

          <div className="results-section">
            <h3>Implementation</h3>
            <p className="result-value" dangerouslySetInnerHTML={{ __html: implementation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
          </div>

          <div className="results-section">
            <h3>Dependency</h3>
            <p className="result-value" dangerouslySetInnerHTML={{ __html: dependency.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
          </div>

          <div className="results-actions">
            <button className="confirm-btn" onClick={onConfirm}>
              APPLY TO GENERATOR
            </button>
            <button className="cancel-btn" onClick={onCancel}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [showResults, setShowResults] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);

  const showQuestionnaireResults = (rec) => {
    setCurrentRecommendation(rec);
    setShowResults(true);
  };

  const applyQuestionnaireToGenerator = (rec) => {
    const { table1, table2 } = questionnaireData;

    let updatedTables = [...tables];

    let t1 = updatedTables.find((t) => t.tableName === table1);
    if (!t1) {
      t1 = {
        id: Date.now(),
        tableName: table1,
        pluralName: pluralize(table1),
        hasOne: [],
        hasMany: [],
        notConnected: [],
        fields: [],
      };
      updatedTables.push(t1);
    }

    let t2 = updatedTables.find((t) => t.tableName === table2);
    if (!t2) {
      t2 = {
        id: Date.now() + 1,
        tableName: table2,
        pluralName: pluralize(table2),
        hasOne: [],
        hasMany: [],
        notConnected: [],
        fields: [],
      };
      updatedTables.push(t2);
    }

    // Reset current links between t1 and t2 only
    t1.hasOne = t1.hasOne.filter(r => r !== table2);
    t1.hasMany = t1.hasMany.filter(r => r !== table2);
    t1.notConnected = t1.notConnected.filter(r => r !== table2);
    t2.hasOne = t2.hasOne.filter(r => r !== table1);
    t2.hasMany = t2.hasMany.filter(r => r !== table1);
    t2.notConnected = t2.notConnected.filter(r => r !== table1);
    
    // Remove old FK fields between these tables
    t1.fields = t1.fields.filter(f => f.name !== `${table2}_id`);
    t2.fields = t2.fields.filter(f => f.name !== `${table1}_id`);
    
    // Determine the FK target table and owner table for relationship attribute placement
    let fkTargetTable = null; // The table that gets the Foreign Key column
    let ownerTable = null;    // The table that gets the 'has many/one' relationship attribute
    let isUnique = false;
    let isFKRequired = !rec.nullable; // nullable=False if user said "cannot exist alone"

    if (rec.table1OwnsMany) { // 1:M (A -> B)
      ownerTable = t1;
      fkTargetTable = t2;
      ownerTable.hasMany.push(table2);
    } else if (rec.table1OwnsOne) { // 1:1 (A -> B)
      ownerTable = t1;
      fkTargetTable = t2;
      ownerTable.hasOne.push(table2);
      isUnique = true;
    } else if (rec.manyToMany) { // M:M
      t1.notConnected.push(table2);
      t2.notConnected.push(table1);
    } else if (rec.table2OwnsMany) { // M:1 (B -> A)
      ownerTable = t2;
      fkTargetTable = t1;
      ownerTable.hasMany.push(table1);
    }

    // Update the FK Target Table Fields
    if (fkTargetTable) {
      const otherTableName = ownerTable.tableName;
      const fkFieldName = `${otherTableName}_id`;
      
      const fkField = {
        name: fkFieldName,
        type: `Integer`,
        nullable: !isFKRequired, // True means nullable=True
        unique: isUnique,
        isFK: true 
      };
      
      // Add new FK field
      fkTargetTable.fields.push(fkField);
    }
    
    setTables(updatedTables);
    setShowQuestionnaire(false);
    setShowResults(false);
  };

  // QUESTIONNAIRE LOGIC END --------------------------------------------------------------------------------------------------

  const QuestionnaireModal = () => {
    const question = questions[currentQuestion];
    const visibleQuestions = questions.filter((q, idx) => {
      if (idx === 0) return true;
      return !q.showIf || q.showIf(questionnaireData);
    });
    const currentVisibleIndex = visibleQuestions.findIndex(q => q.id === question.id);

    return (
      <div className="questionnaire-modal">
        <div className="questionnaire-content">
          <h2>🤔 Relationship Interview</h2>
          <div className="question-progress">
            Step {currentVisibleIndex + 1} of {visibleQuestions.length}
          </div>

          <div className="question-body">
            <h3>
              {typeof question.question === "function"
                ? question.question(questionnaireData)
                : question.question}
            </h3>

            {question.explanation && (
              <p className="question-explanation">
                {typeof question.explanation === "function"
                  ? question.explanation(questionnaireData)
                  : question.explanation}
              </p>
            )}

            {question.type === "input" && (
              <div className="question-inputs">
                {question.fields.map((field, idx) => (
                  <div key={field}>
                    <label>{field === "table1" ? "Table A:" : "Table B:"}</label>
                    <input type="text" placeholder={question.placeholder[idx]} id={field} />
                  </div>
                ))}
                <button
                  onClick={() => {
                    const values = {};
                    question.fields.forEach((field) => {
                      values[field] = document.getElementById(field).value;
                    });
                    handleQuestionnaireAnswer(values);
                  }}
                >
                  NEXT
                </button>
              </div>
            )}

            {question.type === "choice" && (
              <div className="question-choices">
                {question.choices(questionnaireData).map((choice) => (
                  <button key={choice.value} className="choice-button" onClick={() => handleQuestionnaireAnswer(choice.value)}>
                    {choice.label}
                  </button>
                ))}
              </div>
            )}

            {question.type === "boolean" && (
              <div className="question-choices">
                <button className="choice-button no" onClick={() => handleQuestionnaireAnswer(false)}>
                  NO (Must be linked)
                </button>
                <button className="choice-button yes" onClick={() => handleQuestionnaireAnswer(true)}>
                  YES (Can exist alone)
                </button>
              </div>
            )}
          </div>

          <div className="modal-footer">
            {questionnaireHistory.length > 0 && (
              <button className="back-btn" onClick={handleQuestionnairePrevious}>
                ← PREVIOUS
              </button>
            )}
            <button className="cancel-btn" onClick={() => setShowQuestionnaire(false)}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Table editors
  const addTable = () => {
    setTables([
      ...tables,
      {
        id: Date.now(),
        tableName: "",
        pluralName: "",
        hasOne: [],
        hasMany: [],
        notConnected: [],
        fields: [],
      },
    ]);
  };

  const updateTable = (id, key, value) => {
    setTables(
      tables.map((table) => {
        if (table.id === id) {
          const updated = { ...table, [key]: value };

          if (key === "tableName") {
            const oldName = table.tableName;
            updated.pluralName = pluralize(value.toLowerCase());

            // Update references in other tables
            if (oldName && oldName !== value) {
              tables.forEach(otherTable => {
                if (otherTable.id !== id) {
                  // Update relationship arrays
                  ["hasOne", "hasMany", "notConnected"].forEach(k => {
                    otherTable[k] = otherTable[k].map(x => (x === oldName ? value.toLowerCase() : x));
                  });
                  // Update FK field names
                  otherTable.fields = otherTable.fields.map(f => {
                    if (f.isFK && f.name === `${oldName}_id`) {
                      return { ...f, name: `${value.toLowerCase()}_id` };
                    }
                    return f;
                  });
                }
              });
            }
          }

          return updated;
        }
        return table;
      })
    );
  };

  const deleteTable = (id) => {
    const deletedTable = tables.find(t => t.id === id);
    if (!deletedTable || !deletedTable.tableName) {
      setTables(tables.filter((table) => table.id !== id));
      return;
    }

    const deletedTableName = deletedTable.tableName;

    // Remove table and clean up references in other tables
    const updatedTables = tables
      .filter((table) => table.id !== id)
      .map(table => {
        // Remove from relationship arrays
        ["hasOne", "hasMany", "notConnected"].forEach(k => {
          table[k] = table[k].filter(x => x !== deletedTableName);
        });
        // Remove FK fields pointing to deleted table
        table.fields = table.fields.filter(f => !(f.isFK && f.name === `${deletedTableName}_id`));
        return table;
      });

    setTables(updatedTables);
  };

  const addRelationship = (tableId, relationType) => {
    setTables(
      tables.map((table) => {
        if (table.id === tableId) {
          const updated = { ...table };
          updated[relationType] = [...updated[relationType], ""];
          return updated;
        }
        return table;
      })
    );
  };

  const updateRelationship = (tableId, relationType, index, value) => {
    setTables(
      tables.map((table) => {
        if (table.id === tableId) {
          const updated = { ...table };
          updated[relationType][index] = value.toLowerCase();
          return updated;
        }
        return table;
      })
    );
  };

  const deleteRelationship = (tableId, relationType, index) => {
    setTables(
      tables.map((table) => {
        if (table.id === tableId) {
          const updated = { ...table };
          const targetTableName = updated[relationType][index];
          updated[relationType] = updated[relationType].filter((_, idx) => idx !== index);

          // Clean up bidirectional links
          const targetTable = tables.find(t => t.tableName === targetTableName);
          if (targetTable) {
            // Remove FK from target if we owned them
            if (relationType === 'hasMany' || relationType === 'hasOne') {
              targetTable.fields = targetTable.fields.filter(f => f.name !== `${table.tableName}_id`);
            }
            // Remove M:M link from target
            if (relationType === 'notConnected') {
              targetTable.notConnected = targetTable.notConnected.filter(x => x !== table.tableName);
            }
          }

          return updated;
        }
        return table;
      })
    );
  };

  const addField = (tableId) => {
    setTables(
      tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              fields: [...table.fields, { name: "", type: "String(100)", nullable: false, unique: false }],
            }
          : table
      )
    );
  };

  const updateField = (tableId, fieldIndex, key, value) => {
    setTables(
      tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              fields: table.fields.map((field, idx) => {
                if (idx === fieldIndex) {
                  const updated = { ...field, [key]: value };

                  // Validate field name
                  if (key === "name" && value) {
                    const lowerValue = value.toLowerCase();
                    
                    // Check for reserved names
                    if (lowerValue === "id") {
                      alert("Field name 'id' is reserved. Please use a different name.");
                      return field;
                    }
                    
                    // Check for FK conflicts
                    const fkFields = table.fields.filter(f => f.isFK).map(f => f.name);
                    if (fkFields.includes(`${lowerValue}`)) {
                      alert(`Field name '${value}' conflicts with a generated foreign key. Please use a different name.`);
                      return field;
                    }
                    
                    // Check for duplicates (excluding current field)
                    const duplicates = table.fields.filter((f, i) => i !== idx && f.name === lowerValue);
                    if (duplicates.length > 0) {
                      alert(`Field name '${value}' already exists. Please use a unique name.`);
                      return field;
                    }
                  }

                  if (key === "nullable" || key === "unique" || key === "type") {
                    let baseType = updated.type.split(",")[0].trim();
                    const constraints = [];

                    if (updated.unique) constraints.push("unique=True");
                    if (!updated.nullable) constraints.push("nullable=False");

                    updated.type = constraints.length > 0 ? `${baseType}, ${constraints.join(", ")}` : baseType;
                  }

                  return updated;
                }
                return field;
              }),
            }
          : table
      )
    );
  };

  const deleteField = (tableId, fieldIndex) => {
    setTables(
      tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              fields: table.fields.filter((_, idx) => idx !== fieldIndex),
            }
          : table
      )
    );
  };

  // Analyze relationships and produce structured metadata used by generators
  const analyzeRelationships = () => {
    // Build quick lookup by tableName
    const byName = {};
    tables.forEach((t) => {
      if (t.tableName) byName[t.tableName] = t;
    });

    const junctions = new Set();

    return tables.map((table) => {
      const className = table.tableName ? table.tableName.charAt(0).toUpperCase() + table.tableName.slice(1) : "";
      const tablePlural = table.pluralName || pluralize(table.tableName);

      const foreignKeys = [];
      const relationships = [];
      const associationProxies = [];

      // Check if OTHER tables claim to own US -> produce our belongs_to entries
      tables.forEach((otherTable) => {
        if (otherTable.id === table.id) return;
        if (!otherTable.tableName) return;

        const theyOwnUs = (otherTable.hasOne || []).includes(table.tableName) || (otherTable.hasMany || []).includes(table.tableName);

        if (theyOwnUs) {
          // FIXED: Look up FK field in the CURRENT table (the one receiving the FK)
          const fkField = table.fields.find(f => f.isFK && f.name === `${otherTable.tableName}_id`);

          foreignKeys.push({
            fieldName: `${otherTable.tableName}_id`,
            references: pluralize(otherTable.tableName),
            nullable: fkField ? fkField.nullable : false,
            unique: fkField ? fkField.unique : false,
          });

          const isOneToOne = (otherTable.hasOne || []).includes(table.tableName);
          
          relationships.push({
            type: "belongs_to",
            target: otherTable.tableName,
            relationshipName: otherTable.tableName, 
            backPopulates: isOneToOne ? table.tableName : tablePlural,
            description: `${className} belongs to ${otherTable.tableName}`,
          });
        }
      });

      // For tables WE own via hasOne -> create a has_one on us (target has FK)
      (table.hasOne || []).forEach((targetTable) => {
        if (!targetTable) return;

        relationships.push({
          type: "has_one",
          target: targetTable,
          relationshipName: targetTable,
          backPopulates: table.tableName,
          description: `${className} has one ${targetTable}`,
        });
      });

      // For tables WE own via hasMany -> create has_many on us (target has FK)
      (table.hasMany || []).forEach((targetTable) => {
        if (!targetTable) return;
        const targetPlural = pluralize(targetTable);

        relationships.push({
          type: "has_many",
          target: targetTable,
          relationshipName: targetPlural,
          backPopulates: table.tableName,
          description: `${className} has many ${targetPlural}`,
        });

        // Association proxy detection
        if (options.useAssociationProxy) {
          const targetTableObj = byName[targetTable];
          if (targetTableObj) {
            tables.forEach((otherTable) => {
              if (!otherTable.tableName) return;
              if (otherTable.tableName === table.tableName || otherTable.tableName === targetTable) return;

              const otherOwnsTarget = (otherTable.hasMany || []).includes(targetTable) || (otherTable.hasOne || []).includes(targetTable);
              if (otherOwnsTarget) {
                associationProxies.push({
                  proxyName: pluralize(otherTable.tableName),
                  throughRelationship: targetPlural,
                  targetAttribute: otherTable.tableName,
                  description: `Access ${pluralize(otherTable.tableName)} through ${targetPlural}`,
                });
              }
            });
          }
        }
      });

      // Many-to-many (notConnected) -> create junction entries
      (table.notConnected || []).forEach((targetTable) => {
        if (!targetTable) return;
        const targetPlural = pluralize(targetTable);
        const junctionName = [table.tableName, targetTable].sort().join("_");
        junctions.add(junctionName);

        relationships.push({
          type: "many_to_many",
          target: targetTable,
          relationshipName: targetPlural,
          junctionTable: junctionName,
          backPopulates: pluralize(table.tableName),
          description: `${className} has many ${targetPlural} (through ${junctionName})`,
        });
      });

      return {
        ...table,
        className,
        tablePlural,
        generatedForeignKeys: foreignKeys,
        generatedRelationships: relationships,
        associationProxies,
        junctions: Array.from(junctions),
      };
    });
  };

  // Generate Python models (string)
  const generateModels = () => {
    const analyzed = analyzeRelationships();

    let code = `from app.extensions import db, bcrypt\nfrom datetime import datetime, timezone\n`;
    if (options.useAssociationProxy) {
      code += `from sqlalchemy.ext.associationproxy import association_proxy\n`;
    }
    code += `\n`;

    const junctionSet = new Map();
    analyzed.forEach((t) => {
      (t.generatedRelationships || []).forEach((rel) => {
        if (rel.type === "many_to_many" && rel.junctionTable) {
          const parts = rel.junctionTable.split("_");
          if (parts.length === 2) {
            const left = parts[0];
            const right = parts[1];
            junctionSet.set(rel.junctionTable, [left, right]);
          }
        }
      });
    });

    // Emit junction table definitions first
    if (junctionSet.size > 0) {
      junctionSet.forEach((pair, junctionName) => {
        const left = pair[0];
        const right = pair[1];
        const leftPlural = pluralize(left);
        const rightPlural = pluralize(right);
        code += `${junctionName} = db.Table(\n`;
        code += `    '${junctionName}',\n`;
        code += `    db.Column('${left}_id', db.Integer, db.ForeignKey('${leftPlural}.id'), primary_key=True),\n`;
        code += `    db.Column('${right}_id', db.Integer, db.ForeignKey('${rightPlural}.id'), primary_key=True)\n`;
        code += `)\n\n`;
      });
    }

    // Now emit classes
    analyzed.forEach((table) => {
      const className = table.className;
      const tablePlural = table.tablePlural || pluralize(table.tableName);

      code += `class ${className}(db.Model):\n`;
      if (options.addDocstrings) code += `    \"\"\"${className} model representing ${tablePlural}.\"\"\"\n`;
      code += `    __tablename__ = '${tablePlural}'\n\n`;
      code += `    id = db.Column(db.Integer, primary_key=True)\n`;

      // user fields (excluding FKs)
      const customFKNames = table.generatedForeignKeys.map(fk => fk.fieldName);
      
      (table.fields || []).forEach((field) => {
        if (!field.name) return;
        
        // Only emit non-FK fields here; FKs are handled in the dedicated block below
        if (!customFKNames.includes(field.name)) {
          code += `    ${field.name} = db.Column(db.${field.type})\n`;
        }
      });
      
      // generated foreign keys (lowercase plural references) - This block handles nullable/unique constraints
      if ((table.generatedForeignKeys || []).length > 0) {
        code += `\n    # Foreign Keys\n`;
        table.generatedForeignKeys.forEach((fk) => {
          const ref = fk.references.toLowerCase();
          
          let constraints = [];
          if (fk.unique) constraints.push("unique=True");
          if (!fk.nullable) constraints.push("nullable=False");

          let typeAndConstraints = `db.Integer, db.ForeignKey('${ref}.id')`;
          if (constraints.length > 0) {
            typeAndConstraints += `, ${constraints.join(", ")}`;
          }

          code += `    ${fk.fieldName} = db.Column(${typeAndConstraints})\n`;
        });
      }

      // Relationships
      if ((table.generatedRelationships || []).length > 0) {
        code += `\n    # Relationships\n`;
        table.generatedRelationships.forEach((rel) => {
          const targetClass = rel.target.charAt(0).toUpperCase() + rel.target.slice(1);
          const relName = rel.relationshipName;
          code += `    ${relName} = db.relationship('${targetClass}'`;

          if (rel.type === "many_to_many" && rel.junctionTable) {
            code += `, secondary=${rel.junctionTable}`;
          }

          if (options.autoBackPopulates && rel.backPopulates) {
            code += `, back_populates='${rel.backPopulates}'`;
          }
          
          // Add cascade delete for owned relationships (has_many, has_one)
          if (options.cascadeDelete && (rel.type === "has_many" || rel.type === "has_one")) {
            code += `, cascade='all, delete-orphan'`;
          }

          code += `)\n`;
        });
      }

      // Association proxies
      if (options.useAssociationProxy && (table.associationProxies || []).length > 0) {
        code += `\n    # Association Proxies\n`;
        table.associationProxies.forEach((proxy) => {
          const existingRelNames = (table.generatedRelationships || []).map((r) => r.relationshipName);
          let proxyName = proxy.proxyName;
          if (existingRelNames.includes(proxyName)) {
            proxyName = `${proxyName}_proxy`;
          }
          const through = proxy.throughRelationship;
          const targetAttr = proxy.targetAttribute;
          code += `    ${proxyName} = association_proxy('${through}', '${targetAttr}')\n`;
        });
      }

      // repr
      const reprField = (table.fields || []).find((f) => f.name === "name")
        ? "name"
        : (table.fields || []).find((f) => f.name === "title")
        ? "title"
        : "id";
      code += `\n    def __repr__(self):\n`;
      code += `        return f'<${className} {self.${reprField}}>'\n\n\n`;
    });

    return code;
  };

  // Generate serializers (string) - FIXED to check target table fields
  const generateSerializers = () => {
    const analyzed = analyzeRelationships();
    const modelNames = analyzed.map((t) => (t.className ? t.className : t.tableName.charAt(0).toUpperCase() + t.tableName.slice(1)));
    let code = `from app.extensions import ma\nfrom app.models import ${modelNames.join(", ")}\n\n`;

    // Helper function to get appropriate fields for a target table
    const getTargetFields = (targetTableName) => {
      const targetTable = analyzed.find(t => t.tableName === targetTableName);
      if (!targetTable) return "('id')";
      
      // Check what fields the target table actually has
      const hasName = targetTable.fields.some(f => f.name === 'name');
      const hasTitle = targetTable.fields.some(f => f.name === 'title');
      const hasUsername = targetTable.fields.some(f => f.name === 'username');
      
      if (hasUsername) return "('id', 'username')";
      if (hasTitle) return "('id', 'title')";
      if (hasName) return "('id', 'name')";
      return "('id')";
    };

    const sorted = [...analyzed].sort((a, b) => {
      if ((a.generatedForeignKeys || []).length === (b.generatedForeignKeys || []).length) return 0;
      return (a.generatedForeignKeys || []).length < (b.generatedForeignKeys || []).length ? -1 : 1;
    });

    sorted.forEach((table) => {
      const className = table.className || (table.tableName.charAt(0).toUpperCase() + table.tableName.slice(1));
      code += `class ${className}Schema(ma.SQLAlchemyAutoSchema):\n`;
      if (options.addDocstrings) code += `    \"\"\"Schema for ${className} model.\"\"\"\n`;

      // 1. BELONGS_TO/HAS_ONE (The Singular Link)
      const belongsTo = (table.generatedRelationships || []).filter((r) => r.type === "belongs_to" || r.type === "has_one");
      if (belongsTo.length > 0) {
        belongsTo.forEach((rel) => {
          const targetClass = rel.target.charAt(0).toUpperCase() + rel.target.slice(1);
          const fieldName = rel.relationshipName;
          const targetFields = getTargetFields(rel.target);
          
          // Exclude the reverse relationship to prevent circular references
          const excludeRelationship = rel.backPopulates;
          code += `    ${fieldName} = ma.Nested('${targetClass}Schema', only=${targetFields}, exclude=('${excludeRelationship}',))\n`;
        });
      }

      // 2. HAS_MANY / MANY_TO_MANY (The Plural List)
      const hasMany = (table.generatedRelationships || []).filter((r) => r.type === "has_many" || r.type === "many_to_many");
      if (hasMany.length > 0) {
        hasMany.forEach((rel) => {
          const targetClass = rel.target.charAt(0).toUpperCase() + rel.target.slice(1);
          const relName = rel.relationshipName;
          const targetFields = getTargetFields(rel.target);
          
          // Exclude the reverse relationship to prevent circular references
          const excludeRelationship = rel.backPopulates;
          code += `    ${relName} = ma.Nested('${targetClass}Schema', many=True, dump_only=True, only=${targetFields}, exclude=('${excludeRelationship}',))\n`;
        });
      }

      // Association proxy method fields
      if (options.useAssociationProxy && (table.associationProxies || []).length > 0) {
        table.associationProxies.forEach((proxy) => {
          const existingRelNames = (table.generatedRelationships || []).map((r) => r.relationshipName);
          let proxyName = proxy.proxyName;
          if (existingRelNames.includes(proxyName)) proxyName = `${proxyName}_proxy`;
          code += `    ${proxyName} = ma.Method("get_${proxyName}")\n`;
        });
      }

      code += `\n    class Meta:\n`;
      code += `        model = ${className}\n`;
      code += `        load_instance = True\n`;

      if ((belongsTo || []).length > 0) {
        code += `        include_fk = False\n`;
      }

      const excludes = (table.fields || []).filter((f) => f.name && f.name.startsWith("_")).map((f) => `'${f.name}'`);
      if (excludes.length > 0) {
        code += `        exclude = (${excludes.join(", ")})\n`;
      }

      // Add Method implementations for association proxies
      if (options.useAssociationProxy && (table.associationProxies || []).length > 0) {
        code += `\n`;
        table.associationProxies.forEach((proxy) => {
          const targetClass = proxy.targetAttribute.charAt(0).toUpperCase() + proxy.targetAttribute.slice(1);
          const through = proxy.throughRelationship;
          const targetAttr = proxy.targetAttribute;
          let proxyName = proxy.proxyName;
          const existingRelNames = (table.generatedRelationships || []).map((r) => r.relationshipName);
          if (existingRelNames.includes(proxyName)) proxyName = `${proxyName}_proxy`;
          
          const targetFields = getTargetFields(proxy.targetAttribute);

          code += `    def get_${proxyName}(self, obj):\n`;
          code += `        \"\"\"Get unique ${proxyName} through ${through}.\"\"\"\n`;
          code += `        unique_items = []\n`;
          code += `        for item in getattr(obj, '${through}', []):\n`;
          code += `            related = getattr(item, '${targetAttr}', None)\n`;
          code += `            if related and related not in unique_items:\n`;
          code += `                unique_items.append(related)\n`;
          code += `        return ${targetClass}Schema(many=True, only=${targetFields}).dump(unique_items)\n\n`;
        });
      }

      const tablePlural = table.tablePlural || pluralize(table.tableName);
      code += `\n${table.tableName}_schema = ${className}Schema()\n`;
      code += `${tablePlural}_schema = ${className}Schema(many=True)\n\n\n`;
    });

    return code;
  };

  // Generate routes (unchanged)
  const generateRoutes = () => {
    const analyzed = analyzeRelationships();
    const modelNames = analyzed.map((t) => (t.className ? t.className : t.tableName.charAt(0).toUpperCase() + t.tableName.slice(1)));
    let code = `from flask import request, jsonify, session\nfrom flask_restful import Resource\nfrom app.extensions import db\nfrom app.models import ${modelNames.join(", ")}\n`;
    code += `from app.serializers import (\n`;
    code += analyzed
      .map((t) => {
        const tablePlural = t.tablePlural || pluralize(t.tableName);
        return `    ${t.tableName}_schema, ${tablePlural}_schema`;
      })
      .join(",\n");
    code += `\n)\n\n`;

    analyzed.forEach((table) => {
      const className = table.className || (table.tableName.charAt(0).toUpperCase() + table.tableName.slice(1));
      const tablePlural = table.tablePlural || pluralize(table.tableName);

      code += `class ${className}List(Resource):\n`;
      if (options.addDocstrings) code += `    \"\"\"Resource for listing and creating ${tablePlural}.\"\"\"\n\n`;

      code += `    def get(self):\n`;
      if (options.addRouteDocstrings) code += `        \"\"\"Get all ${tablePlural}.\"\"\"\n`;

      if (options.addPagination) {
        code += `        page = request.args.get('page', 1, type=int)\n`;
        code += `        per_page = request.args.get('per_page', ${options.defaultPageSize}, type=int)\n`;
        code += `        pagination = ${className}.query.paginate(page=page, per_page=per_page)\n`;
        code += `        return {\n`;
        code += `            'items': ${tablePlural}_schema.dump(pagination.items),\n`;
        code += `            'total': pagination.total,\n`;
        code += `            'page': page,\n`;
        code += `            'per_page': per_page\n`;
        code += `        }, 200\n\n`;
      } else {
        code += `        ${tablePlural} = ${className}.query.all()\n`;
        code += `        return ${tablePlural}_schema.dump(${tablePlural}), 200\n\n`;
      }

      code += `    def post(self):\n`;
      if (options.addRouteDocstrings) code += `        \"\"\"Create new ${table.tableName}.\"\"\"\n`;
      code += `        try:\n`;
      code += `            data = request.get_json()\n`;
      code += `            ${table.tableName} = ${className}(**data)\n`;
      code += `            db.session.add(${table.tableName})\n`;
      code += `            db.session.commit()\n`;
      code += `            return ${table.tableName}_schema.dump(${table.tableName}), 201\n`;
      code += `        except Exception as e:\n`;
      code += `            db.session.rollback()\n`;
      code += `            return {'error': str(e)}, 400\n\n\n`;

      code += `class ${className}Detail(Resource):\n`;
      if (options.addDocstrings) code += `    \"\"\"Resource for individual ${table.tableName} operations.\"\"\"\n\n`;

      code += `    def get(self, ${table.tableName}_id):\n`;
      if (options.addRouteDocstrings) code += `        \"\"\"Get single ${table.tableName}.\"\"\"\n`;
      code += `        ${table.tableName} = ${className}.query.get_or_404(${table.tableName}_id)\n`;
      code += `        return ${table.tableName}_schema.dump(${table.tableName}), 200\n\n`;

      code += `    def patch(self, ${table.tableName}_id):\n`;
      if (options.addRouteDocstrings) code += `        \"\"\"Update ${table.tableName}.\"\"\"\n`;
      code += `        ${table.tableName} = ${className}.query.get_or_404(${table.tableName}_id)\n`;
      code += `        data = request.get_json()\n`;
      code += `        \n`;
      code += `        # Prevent modification of foreign keys and relationships\n`;
      const protectedFields = [];
      if (table.generatedForeignKeys.length > 0) {
        table.generatedForeignKeys.forEach(fk => protectedFields.push(`'${fk.fieldName}'`));
      }
      if (table.generatedRelationships.length > 0) {
        table.generatedRelationships.forEach(rel => protectedFields.push(`'${rel.relationshipName}'`));
      }
      if (protectedFields.length > 0) {
        code += `        protected_fields = [${protectedFields.join(", ")}]\n`;
        code += `        \n`;
        code += `        for key, value in data.items():\n`;
        code += `            if key not in protected_fields:\n`;
        code += `                setattr(${table.tableName}, key, value)\n`;
      } else {
        code += `        for key, value in data.items():\n`;
        code += `            setattr(${table.tableName}, key, value)\n`;
      }
      code += `        \n`;
      code += `        db.session.commit()\n`;
      code += `        return ${table.tableName}_schema.dump(${table.tableName}), 200\n\n`;

      code += `    def delete(self, ${table.tableName}_id):\n`;
      if (options.addRouteDocstrings) code += `        \"\"\"Delete ${table.tableName}.\"\"\"\n`;
      code += `        ${table.tableName} = ${className}.query.get_or_404(${table.tableName}_id)\n`;
      code += `        db.session.delete(${table.tableName})\n`;
      code += `        db.session.commit()\n`;
      code += `        return {'message': 'Deleted'}, 200\n\n\n`;
    });

    code += `def initialize_routes(api):\n`;
    if (options.addRouteDocstrings) code += `    \"\"\"Register all API endpoints.\"\"\"\n`;
    analyzed.forEach((table) => {
      const className = table.className || (table.tableName.charAt(0).toUpperCase() + table.tableName.slice(1));
      const tablePlural = table.tablePlural || pluralize(table.tableName);
      code += `    api.add_resource(${className}List, '/api/${tablePlural}')\n`;
      code += `    api.add_resource(${className}Detail, '/api/${tablePlural}/<int:${table.tableName}_id>')\n`;
    });

    return code;
  };

  const handleGenerate = () => {
    // Validation before generating code
    const errors = [];
    
    tables.forEach((table, idx) => {
      // Check for empty table name
      if (!table.tableName || table.tableName.trim() === "") {
        errors.push(`Table ${idx + 1} has no name`);
      }
      
      // Check for invalid characters in table name
      if (table.tableName && !/^[a-z][a-z0-9_]*$/.test(table.tableName)) {
        errors.push(`Table "${table.tableName}" has invalid name (use lowercase letters, numbers, underscores only, must start with letter)`);
      }
      
      // Check for duplicate table names
      const duplicates = tables.filter(t => t.tableName === table.tableName);
      if (duplicates.length > 1) {
        errors.push(`Duplicate table name: "${table.tableName}"`);
      }
      
      // Check for empty field names
      table.fields.forEach((field, fieldIdx) => {
        if (!field.isFK && (!field.name || field.name.trim() === "")) {
          errors.push(`Table "${table.tableName}" has field ${fieldIdx + 1} with no name`);
        }
      });
    });
    
    if (errors.length > 0) {
      alert("Cannot generate code. Please fix the following errors:\n\n" + errors.join("\n"));
      return;
    }
    
    setGeneratedCode({
      models: generateModels(),
      serializers: generateSerializers(),
      routes: generateRoutes(),
    });
    setShowCode(true);
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert("Copied to clipboard!");
  };

  return (
    <div className="generator-page">
      <h1>
        <Code size={24} />
        Flask CRUD Generator
      </h1>

      {showQuestionnaire && !showResults && <QuestionnaireModal />}
      {showResults && (
        <ResultsModal
          recommendation={currentRecommendation}
          onConfirm={() => applyQuestionnaireToGenerator(currentRecommendation)}
          onCancel={() => {
            setShowResults(false);
            setShowQuestionnaire(false);
          }}
        />
      )}

      {!showCode ? (
        <>
          <div style={{ display: "flex", gap: "15px", marginBottom: "30px", flexWrap: "wrap" }}>
            <button onClick={addTable}>
              <Plus size={16} /> ADD TABLE
            </button>
            <button onClick={startQuestionnaire}>
              <HelpCircle size={16} /> RELATIONSHIP HELPER
            </button>
            <button onClick={() => setShowCustomizer(!showCustomizer)}>
              <Settings size={16} /> OPTIONS
            </button>
          </div>

          {showCustomizer && (
            <div className="customizer-panel">
              <h2>⚙️ OPTIONS</h2>

              <div className="customizer-grid">
                <div className="customizer-section">
                  <h3>💅 Style</h3>
                  <label>
                    <input type="checkbox" checked={options.addDocstrings} onChange={(e) => updateOption("addDocstrings", e.target.checked)} />
                    Docstrings
                  </label>
                  <label>
                    <input type="checkbox" checked={options.autoBackPopulates} onChange={(e) => updateOption("autoBackPopulates", e.target.checked)} />
                    back_populates
                  </label>
                </div>

                <div className="customizer-section">
                  <h3>✨ Features</h3>
                  <label>
                    <input type="checkbox" checked={options.useAssociationProxy} onChange={(e) => updateOption("useAssociationProxy", e.target.checked)} />
                    Association Proxies
                  </label>
                  <label>
                    <input type="checkbox" checked={options.cascadeDelete} onChange={(e) => updateOption("cascadeDelete", e.target.checked)} />
                    Cascade Delete
                  </label>
                </div>

                <div className="customizer-section">
                  <h3>📄 Pagination</h3>
                  <label>
                    <input type="checkbox" checked={options.addPagination} onChange={(e) => updateOption("addPagination", e.target.checked)} />
                    Enable
                  </label>
                  {options.addPagination && (
                    <label>
                      Size:
                      <input
                        type="number"
                        value={options.defaultPageSize}
                        onChange={(e) => updateOption("defaultPageSize", parseInt(e.target.value))}
                        style={{ width: "60px", marginLeft: "10px" }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <button onClick={() => setShowCustomizer(false)} style={{ marginTop: "20px" }}>
                DONE
              </button>
            </div>
          )}

          <div className="generator-tables">
            {tables.map((table) => (
              <div key={table.id} className="generator-table-card">
                <div className="table-card-header">
                  <Database size={20} />
                  <button onClick={() => deleteTable(table.id)} style={{ marginLeft: "auto" }}>
                    <Trash2 size={14} /> DELETE
                  </button>
                </div>

                <div className="table-card-body">
                  <div className="naming-section">
                    <div className="naming-row">
                      <label>Table Name (singular, lowercase):</label>
                      <input type="text" placeholder="user" value={table.tableName} onChange={(e) => updateTable(table.id, "tableName", e.target.value.toLowerCase())} />
                    </div>

                    <div className="naming-row">
                      <label>Table Name (plural, lowercase):</label>
                      <input type="text" placeholder={table.tableName ? pluralize(table.tableName) : "users"} value={table.pluralName} disabled style={{ opacity: 0.6 }} />
                      <span className="auto-label">AUTO</span>
                    </div>

                    <div className="naming-row">
                      <label>Relationship list name:</label>
                      <input type="text" value={table.pluralName || pluralize(table.tableName)} disabled style={{ opacity: 0.6 }} />
                      <span className="auto-label">AUTO</span>
                    </div>

                    <div className="naming-row">
                      <label>Foreign key (_id) name:</label>
                      <input type="text" value={table.tableName ? `${table.tableName}_id` : "user_id"} disabled style={{ opacity: 0.6 }} />
                      <span className="auto-label">AUTO</span>
                    </div>
                  </div>

                  <div className="relationships-section">
                    <div className="relationship-info">
                      <h4>⚡ Relationships</h4>
                      <p>Use the <strong>RELATIONSHIP HELPER</strong> button above to define connections between tables.</p>
                      <p>The helper will guide you through creating proper relationships with correct foreign keys.</p>
                      
                      {(table.hasOne.length > 0 || table.hasMany.length > 0 || table.notConnected.length > 0) && (
                        <>
                          <h5 style={{ marginTop: '15px' }}>Current Relationships:</h5>
                          <ul style={{ listStyle: 'none', padding: 0 }}>
                            {table.hasOne.map((rel, idx) => (
                              <li key={`one-${idx}`}>
                                ✓ Has one <strong>{rel}</strong> (1:1)
                                <button 
                                  onClick={() => deleteRelationship(table.id, "hasOne", idx)}
                                  style={{ marginLeft: '10px', padding: '2px 8px', fontSize: '12px' }}
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                            {table.hasMany.map((rel, idx) => (
                              <li key={`many-${idx}`}>
                                ✓ Has many <strong>{pluralize(rel)}</strong> (1:M)
                                <button 
                                  onClick={() => deleteRelationship(table.id, "hasMany", idx)}
                                  style={{ marginLeft: '10px', padding: '2px 8px', fontSize: '12px' }}
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                            {table.notConnected.map((rel, idx) => (
                              <li key={`m2m-${idx}`}>
                                ✓ Links with <strong>{pluralize(rel)}</strong> (M:M)
                                <button 
                                  onClick={() => deleteRelationship(table.id, "notConnected", idx)}
                                  style={{ marginLeft: '10px', padding: '2px 8px', fontSize: '12px' }}
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="fields-section">
                    <h4>Custom Fields:</h4>
                    {table.fields.filter(f => !f.isFK).map((field, idx) => {
                      const actualIndex = table.fields.indexOf(field);
                      return (
                        <div key={actualIndex} className="field-row-extended">
                          <input type="text" placeholder="username" value={field.name} onChange={(e) => updateField(table.id, actualIndex, "name", e.target.value)} />
                          <input type="text" placeholder="String(100)" value={field.type.split(",")[0].trim()} onChange={(e) => updateField(table.id, actualIndex, "type", e.target.value)} />
                          <label className="field-checkbox">
                            <input type="checkbox" checked={!field.nullable} onChange={(e) => updateField(table.id, actualIndex, "nullable", !e.target.checked)} />
                            <span>Required</span>
                          </label>
                          <label className="field-checkbox">
                            <input type="checkbox" checked={field.unique} onChange={(e) => updateField(table.id, actualIndex, "unique", e.target.checked)} />
                            <span>Unique</span>
                          </label>
                          <button onClick={() => deleteField(table.id, actualIndex)}>X</button>
                        </div>
                      );
                    })}
                    <button className="add-field-btn" onClick={() => addField(table.id)}>
                      + Add Field
                    </button>
                    
                    {table.fields.filter(f => f.isFK).length > 0 && (
                      <>
                        <h4 style={{ marginTop: '20px' }}>Generated Foreign Keys (Read-Only):</h4>
                        {table.fields.filter(f => f.isFK).map((field, idx) => (
                          <div key={`fk-${idx}`} className="field-row-extended fk-field">
                            <input type="text" value={field.name} disabled />
                            <input type="text" value="Integer (FK)" disabled />
                            <label className="field-checkbox">
                              <input type="checkbox" checked={!field.nullable} disabled />
                              <span>Required</span>
                            </label>
                            <label className="field-checkbox">
                              <input type="checkbox" checked={field.unique} disabled />
                              <span>Unique</span>
                            </label>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {tables.length > 0 && (
            <button className="generate-code-btn" onClick={handleGenerate}>
              GENERATE CODE
            </button>
          )}
        </>
      ) : (
        <>
          <button className="back-to-editor-btn" onClick={() => setShowCode(false)}>
            <ArrowLeft size={16} /> BACK TO EDITOR
          </button>

          <div className="code-output-section">
            <h2>MODELS.PY</h2>
            <button className="copy-code-btn" onClick={() => copyToClipboard(generatedCode.models)}>
              <Copy size={14} /> COPY
            </button>
            <pre className="code-output-pre">{generatedCode.models}</pre>
          </div>

          <div className="code-output-section">
            <h2>SERIALIZERS.PY</h2>
            <button className="copy-code-btn" onClick={() => copyToClipboard(generatedCode.serializers)}>
              <Copy size={14} /> COPY
            </button>
            <pre className="code-output-pre">{generatedCode.serializers}</pre>
          </div>

          <div className="code-output-section">
            <h2>ROUTES.PY</h2>
            <button className="copy-code-btn" onClick={() => copyToClipboard(generatedCode.routes)}>
              <Copy size={14} /> COPY
            </button>
            <pre className="code-output-pre">{generatedCode.routes}</pre>
          </div>
        </>
      )}
    </div>
  );
}