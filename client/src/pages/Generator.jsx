// Generator.jsx - COMPLETE WITH ASSOCIATION PROXIES (FIXED, DROP-IN)
import { useState } from "react";
import { Code, Database, ArrowLeft, Copy, Plus, Trash2, Settings, HelpCircle } from "lucide-react";

export function Generator() {
  const [tables, setTables] = useState([]);
  const [showCode, setShowCode] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
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
    };

    if (irregulars[lower]) return irregulars[lower];
    if (lower.match(/[^aeiou]y$/)) return lower.slice(0, -1) + "ies";
    if (lower.match(/(s|ss|sh|ch|x|z)$/)) return lower + "es";
    return lower + "s";
  };

  // QUESTIONNAIRE LOGIC (unchanged)
  const startQuestionnaire = () => {
    setQuestionnaireData({
      table1: "",
      table2: "",
      answers: {},
    });
    setCurrentQuestion(0);
    setShowQuestionnaire(true);
  };

  const questions = [
    {
      id: "table_names",
      question: "What are the two tables you want to connect?",
      type: "input",
      fields: ["table1", "table2"],
      placeholder: ["user", "cheat"],
    },
    {
      id: "who_creates",
      question: (data) => `Who creates a ${data.table2}?`,
      type: "choice",
      choices: (data) => [
        { value: "table1", label: `A ${data.table1} creates it` },
        { value: "table2", label: `A ${data.table2} creates it` },
        { value: "both", label: "Both can create it" },
        { value: "neither", label: "Neither (they reference each other indirectly)" },
      ],
    },
    {
      id: "can_exist_without",
      question: (data) => `Can a ${data.table2} exist without a ${data.table1}?`,
      type: "boolean",
      showIf: (data) => data.answers.who_creates === "table1",
    },
    {
      id: "belongs_to",
      question: (data) => `Does a ${data.table1} need a ${data.table2}_id?`,
      type: "boolean",
      explanation: (data) => `In other words: Does a ${data.table1} BELONG TO a ${data.table2}?`,
    },
    {
      id: "uses",
      question: (data) => `Does the ${data.table2} USE/REFERENCE a ${data.table1}?`,
      type: "boolean",
      explanation: (data) => `Example: A cheat USES a language (JavaScript, Python, etc.)`,
    },
  ];

  const handleQuestionnaireAnswer = (value) => {
    const question = questions[currentQuestion];

    let updatedData = { ...questionnaireData };

    if (question.id === "table_names") {
      updatedData.table1 = value.table1.toLowerCase();
      updatedData.table2 = value.table2.toLowerCase();
    } else {
      updatedData.answers = {
        ...updatedData.answers,
        [question.id]: value,
      };
    }

    setQuestionnaireData(updatedData);

    let nextQuestion = currentQuestion + 1;

    while (nextQuestion < questions.length) {
      const nextQ = questions[nextQuestion];
      if (nextQ.showIf && !nextQ.showIf(updatedData)) {
        nextQuestion++;
      } else {
        break;
      }
    }

    if (nextQuestion >= questions.length) {
      setTimeout(() => analyzeQuestionnaireResults(updatedData), 100);
    } else {
      setCurrentQuestion(nextQuestion);
    }
  };

  const analyzeQuestionnaireResults = (data) => {
    const { table1, table2, answers } = data;

    let recommendation = {
      table1Owns: false,
      table2Owns: false,
      manyToMany: false,
    };

    if (answers.who_creates === "table1" && answers.can_exist_without === false) {
      recommendation.table1Owns = true;
    } else if (answers.who_creates === "table2") {
      recommendation.table2Owns = true;
    } else if (answers.who_creates === "both" || answers.who_creates === "neither") {
      recommendation.manyToMany = true;
    }

    if (answers.uses === true && !recommendation.table1Owns) {
      recommendation.table1Owns = true;
    }

    showQuestionnaireResults(recommendation);
  };

  const showQuestionnaireResults = (rec) => {
    const { table1, table2 } = questionnaireData;
    const table1Plural = pluralize(table1);
    const table2Plural = pluralize(table2);

    let result = `📋 RECOMMENDATION:\n\n`;

    if (rec.table1Owns) {
      result += `✅ ${table1.toUpperCase()} "has many" ${table2}\n\n`;
      result += `What gets created:\n`;
      result += `  • ${table1} gets: ${table2Plural} (relationship)\n`;
      result += `  • ${table2} gets: ${table1}_id (FK) + ${table1} (relationship)\n\n`;
      result += `This means:\n`;
      result += `  • A ${table1} can have multiple ${table2Plural}\n`;
      result += `  • Each ${table2} belongs to ONE ${table1}\n`;
    } else if (rec.table2Owns) {
      result += `✅ ${table2.toUpperCase()} "has many" ${table1}\n\n`;
      result += `What gets created:\n`;
      result += `  • ${table2} gets: ${table1Plural} (relationship)\n`;
      result += `  • ${table1} gets: ${table2}_id (FK) + ${table2} (relationship)\n\n`;
      result += `This means:\n`;
      result += `  • A ${table2} can have multiple ${table1Plural}\n`;
      result += `  • Each ${table1} belongs to ONE ${table2}\n`;
    } else if (rec.manyToMany) {
      const junction = [table1, table2].sort().join("_");
      result += `✅ ${table1.toUpperCase()} and ${table2.toUpperCase()} are MANY-TO-MANY\n\n`;
      result += `What gets created:\n`;
      result += `  • Junction table: ${junction}\n`;
      result += `  • ${table1} gets: ${table2Plural} (relationship through junction)\n`;
      result += `  • ${table2} gets: ${table1Plural} (relationship through junction)\n\n`;
      result += `This means:\n`;
      result += `  • A ${table1} can have multiple ${table2Plural}\n`;
      result += `  • A ${table2} can have multiple ${table1Plural}\n`;
    }

    result += `\nApply this to your generator?`;

    if (window.confirm(result)) {
      applyQuestionnaireToGenerator(rec);
    }

    setShowQuestionnaire(false);
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

    if (rec.table1Owns) {
      if (!t1.hasMany.includes(table2)) {
        t1.hasMany.push(table2);
      }
    } else if (rec.table2Owns) {
      if (!t2.hasMany.includes(table1)) {
        t2.hasMany.push(table1);
      }
    } else if (rec.manyToMany) {
      if (!t1.notConnected.includes(table2)) {
        t1.notConnected.push(table2);
      }
      if (!t2.notConnected.includes(table1)) {
        t2.notConnected.push(table1);
      }
    }

    setTables(updatedTables);
  };

  const QuestionnaireModal = () => {
    const question = questions[currentQuestion];

    return (
      <div className="questionnaire-modal">
        <div className="questionnaire-content">
          <h2>🤔 Relationship Questionnaire</h2>
          <div className="question-progress">
            Question {currentQuestion + 1} of {questions.length}
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
                    <label>{field === "table1" ? "First table:" : "Second table:"}</label>
                    <input type="text" placeholder={question.placeholder[idx]} id={field} />
                  </div>
                ))}
                <button
                  onClick={() => {
                    const values = {};
                    question.fields.forEach((field) => {
                      values[field] = document.getElementById(field).value;
                    });
                    if (values.table1 && values.table2) {
                      handleQuestionnaireAnswer(values);
                    }
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
                <button className="choice-button yes" onClick={() => handleQuestionnaireAnswer(true)}>
                  YES
                </button>
                <button className="choice-button no" onClick={() => handleQuestionnaireAnswer(false)}>
                  NO
                </button>
              </div>
            )}
          </div>

          <button className="cancel-btn" onClick={() => setShowQuestionnaire(false)}>
            CANCEL
          </button>
        </div>
      </div>
    );
  };

  // Table editors (unchanged)
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
            updated.pluralName = pluralize(value.toLowerCase());
          }

          return updated;
        }
        return table;
      })
    );
  };

  const deleteTable = (id) => {
    setTables(tables.filter((table) => table.id !== id));
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
          updated[relationType][index] = value;
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
          updated[relationType] = updated[relationType].filter((_, idx) => idx !== index);
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

    // We'll collect junctions globally to avoid dupes
    const junctions = new Set();

    return tables.map((table) => {
      const className = table.tableName ? table.tableName.charAt(0).toUpperCase() + table.tableName.slice(1) : "";
      const tablePlural = table.pluralName || pluralize(table.tableName);

      const foreignKeys = [];
      const relationships = [];
      const generatedFields = [];
      const associationProxies = [];

      // Check if OTHER tables claim to own US -> produce our belongs_to entries
      tables.forEach((otherTable) => {
        if (otherTable.id === table.id) return;
        if (!otherTable.tableName) return;

        const theyOwnUs = (otherTable.hasOne || []).includes(table.tableName) || (otherTable.hasMany || []).includes(table.tableName);

        if (theyOwnUs) {
          // foreign key on us pointing to otherTable
          foreignKeys.push({
            fieldName: `${otherTable.tableName}_id`,
            references: pluralize(otherTable.tableName), // already lowercased plural
          });

          const isOneToOne = (otherTable.hasOne || []).includes(table.tableName);
          // our relationship to other table (belongs_to)
          relationships.push({
            type: "belongs_to",
            target: otherTable.tableName,
            relationshipName: otherTable.tableName, // singular
            backPopulates: isOneToOne ? table.tableName : tablePlural, // match what's set on the other side
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

        generatedFields.push({
          type: "relationship_created",
          tableName: targetTable,
          fieldName: `${table.tableName}_id`,
          relationshipName: table.tableName,
          description: `In ${targetTable}: ${table.tableName}_id (FK) and ${table.tableName} (relationship) created`,
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

        generatedFields.push({
          type: "relationship_created",
          tableName: targetTable,
          fieldName: `${table.tableName}_id`,
          relationshipName: table.tableName,
          description: `In ${targetTable}: ${table.tableName}_id (FK) and ${table.tableName} (relationship) created`,
        });

        // Association proxy detection:
        if (options.useAssociationProxy) {
          const targetTableObj = byName[targetTable];
          if (targetTableObj) {
            // For each OTHER table that owns the targetTable, we can proxy to that other table via our target
            tables.forEach((otherTable) => {
              if (!otherTable.tableName) return;
              if (otherTable.tableName === table.tableName || otherTable.tableName === targetTable) return;

              const otherOwnsTarget = (otherTable.hasMany || []).includes(targetTable) || (otherTable.hasOne || []).includes(targetTable);
              if (otherOwnsTarget) {
                associationProxies.push({
                  proxyName: pluralize(otherTable.tableName), // e.g., users
                  throughRelationship: targetPlural, // our relationship name to target
                  targetAttribute: otherTable.tableName, // attribute on target pointing to otherTable
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

        generatedFields.push({
          type: "junction_table",
          tableName: junctionName,
          description: `Junction table ${junctionName} created with ${table.tableName}_id and ${targetTable}_id`,
        });
      });

      return {
        ...table,
        className,
        tablePlural,
        generatedForeignKeys: foreignKeys,
        generatedRelationships: relationships,
        generatedFields,
        associationProxies,
        junctions: Array.from(junctions), // for potential use if needed
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

    // Collect junction tables globally (unique)
    const junctionSet = new Map(); // junctionName -> [left, right]
    analyzed.forEach((t) => {
      (t.generatedFields || []).forEach((gf) => {
        if (gf.type === "junction_table") {
          const parts = gf.tableName.split("_");
          if (parts.length === 2) {
            const left = parts[0];
            const right = parts[1];
            const name = [left, right].sort().join("_");
            junctionSet.set(name, [left, right]);
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

      // user fields
      (table.fields || []).forEach((field) => {
        if (!field.name) return;
        code += `    ${field.name} = db.Column(db.${field.type})\n`;
      });

      // generated foreign keys (lowercase plural references)
      if ((table.generatedForeignKeys || []).length > 0) {
        code += `\n    # Foreign Keys\n`;
        table.generatedForeignKeys.forEach((fk) => {
          // ensure references are lowercase plural
          const ref = fk.references.toLowerCase();
          code += `    ${fk.fieldName} = db.Column(db.Integer, db.ForeignKey('${ref}.id'), nullable=False)\n`;
        });
      }

      // Relationships
      if ((table.generatedRelationships || []).length > 0) {
        code += `\n    # Relationships\n`;
        table.generatedRelationships.forEach((rel) => {
          const targetClass = rel.target.charAt(0).toUpperCase() + rel.target.slice(1);
          // make a safe relationship attribute name (python var)
          const relName = rel.relationshipName;
          code += `    ${relName} = db.relationship('${targetClass}'`;

          // For many-to-many provide secondary
          if (rel.type === "many_to_many" && rel.junctionTable) {
            code += `, secondary=${rel.junctionTable}`;
          }

          if (options.autoBackPopulates && rel.backPopulates) {
            code += `, back_populates='${rel.backPopulates}'`;
          }

          code += `)\n`;
        });
      }

      // Association proxies - ensure we don't overwrite a relationship attribute
      if (options.useAssociationProxy && (table.associationProxies || []).length > 0) {
        code += `\n    # Association Proxies\n`;
        table.associationProxies.forEach((proxy) => {
          // avoid name collision with existing relationship names
          const existingRelNames = (table.generatedRelationships || []).map((r) => r.relationshipName);
          let proxyName = proxy.proxyName;
          if (existingRelNames.includes(proxyName)) {
            proxyName = `${proxyName}_proxy`;
          }
          // throughRelationship should be the name of relationship on this class pointing to the intermediate table
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

  // Generate serializers (string) - adds safe proxy methods
  const generateSerializers = () => {
    const analyzed = analyzeRelationships();
    const modelNames = analyzed.map((t) => (t.className ? t.className : t.tableName.charAt(0).toUpperCase() + t.tableName.slice(1)));
    let code = `from app.extensions import ma\nfrom app.models import ${modelNames.join(", ")}\n\n`;

    const sorted = [...analyzed].sort((a, b) => {
      if ((a.generatedForeignKeys || []).length === (b.generatedForeignKeys || []).length) return 0;
      return (a.generatedForeignKeys || []).length < (b.generatedForeignKeys || []).length ? -1 : 1;
    });

    sorted.forEach((table) => {
      const className = table.className || (table.tableName.charAt(0).toUpperCase() + table.tableName.slice(1));
      code += `class ${className}Schema(ma.SQLAlchemyAutoSchema):\n`;
      if (options.addDocstrings) code += `    \"\"\"Schema for ${className} model.\"\"\"\n`;

      const belongsTo = (table.generatedRelationships || []).filter((r) => r.type === "belongs_to");
      if (belongsTo.length > 0) {
        belongsTo.forEach((rel) => {
          const targetClass = rel.target.charAt(0).toUpperCase() + rel.target.slice(1);
          const fieldName = rel.target;
          code += `    ${fieldName} = ma.Nested(${targetClass}Schema, only=('id', 'name'))\n`;
        });
      }

      // Association proxy method fields
      if (options.useAssociationProxy && (table.associationProxies || []).length > 0) {
        table.associationProxies.forEach((proxy) => {
          // ensure serializer field name matches generated proxy name in models (account for collisions)
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

      // Add Method implementations for association proxies - safe unique collection
      if (options.useAssociationProxy && (table.associationProxies || []).length > 0) {
        code += `\n`;
        table.associationProxies.forEach((proxy) => {
          const targetClass = proxy.targetAttribute.charAt(0).toUpperCase() + proxy.targetAttribute.slice(1);
          const through = proxy.throughRelationship;
          const targetAttr = proxy.targetAttribute;
          let proxyName = proxy.proxyName;
          const existingRelNames = (table.generatedRelationships || []).map((r) => r.relationshipName);
          if (existingRelNames.includes(proxyName)) proxyName = `${proxyName}_proxy`;

          code += `    def get_${proxyName}(self, obj):\n`;
          code += `        \"\"\"Get unique ${proxyName} through ${through}.\"\"\"\n`;
          code += `        unique_items = []\n`;
          code += `        for item in getattr(obj, '${through}', []):\n`;
          code += `            related = getattr(item, '${targetAttr}', None)\n`;
          code += `            if related and related not in unique_items:\n`;
          code += `                unique_items.append(related)\n`;
          code += `        return ${targetClass}Schema(many=True, only=('id', 'name')).dump(unique_items)\n\n`;
        });
      }

      const tablePlural = table.tablePlural || pluralize(table.tableName);
      code += `\n${table.tableName}_schema = ${className}Schema()\n`;
      code += `${tablePlural}_schema = ${className}Schema(many=True)\n\n\n`;
    });

    return code;
  };

  // Generate routes (string)
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
      code += `        data = request.get_json()\n`;
      code += `        ${table.tableName} = ${className}(**data)\n`;
      code += `        db.session.add(${table.tableName})\n`;
      code += `        db.session.commit()\n`;
      code += `        return ${table.tableName}_schema.dump(${table.tableName}), 201\n\n\n`;

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
      code += `        for key, value in data.items():\n`;
      code += `            setattr(${table.tableName}, key, value)\n`;
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

      {showQuestionnaire && <QuestionnaireModal />}

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
                      <label>Table (singular, lowercase):</label>
                      <input type="text" placeholder="user" value={table.tableName} onChange={(e) => updateTable(table.id, "tableName", e.target.value.toLowerCase())} />
                    </div>

                    <div className="naming-row">
                      <label>Table name (plural, lowercase):</label>
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
                    <div className="relationship-group">
                      <h4>
                        A <strong>{table.tableName || "table"}/{table.pluralName || pluralize(table.tableName || "table")}</strong> has one:
                      </h4>
                      {table.hasOne.map((rel, idx) => (
                        <div key={idx} className="relationship-input-row">
                          <input type="text" placeholder="profile (singular)" value={rel} onChange={(e) => updateRelationship(table.id, "hasOne", idx, e.target.value.toLowerCase())} />
                          <button onClick={() => deleteRelationship(table.id, "hasOne", idx)}>X</button>
                          {rel && <span className="creates-hint">Creates: {table.tableName}_id in {rel}</span>}
                        </div>
                      ))}
                      <button className="add-rel-btn" onClick={() => addRelationship(table.id, "hasOne")}>
                        + Add "has one"
                      </button>
                    </div>

                    <div className="relationship-group">
                      <h4>
                        A <strong>{table.tableName || "table"}/{table.pluralName || pluralize(table.tableName || "table")}</strong> has many:
                      </h4>
                      {table.hasMany.map((rel, idx) => (
                        <div key={idx} className="relationship-input-row">
                          <input type="text" placeholder="post (singular)" value={rel} onChange={(e) => updateRelationship(table.id, "hasMany", idx, e.target.value.toLowerCase())} />
                          <button onClick={() => deleteRelationship(table.id, "hasMany", idx)}>X</button>
                          {rel && <span className="creates-hint">Creates: {table.tableName}_id in {rel}</span>}
                        </div>
                      ))}
                      <button className="add-rel-btn" onClick={() => addRelationship(table.id, "hasMany")}>
                        + Add "has many"
                      </button>
                    </div>

                    <div className="relationship-group">
                      <h4>
                        A <strong>{table.tableName || "table"}/{table.pluralName || pluralize(table.tableName || "table")}</strong> is not directly connected with:
                      </h4>
                      {table.notConnected.map((rel, idx) => (
                        <div key={idx} className="relationship-input-row">
                          <input type="text" placeholder="tag (singular)" value={rel} onChange={(e) => updateRelationship(table.id, "notConnected", idx, e.target.value.toLowerCase())} />
                          <button onClick={() => deleteRelationship(table.id, "notConnected", idx)}>X</button>
                          {rel && <span className="creates-hint">Creates junction: {[table.tableName, rel].sort().join("_")}</span>}
                        </div>
                      ))}
                      <button className="add-rel-btn" onClick={() => addRelationship(table.id, "notConnected")}>
                        + Add M:M
                      </button>
                    </div>
                  </div>

                  <div className="fields-section">
                    <h4>Additional Fields:</h4>
                    {table.fields.map((field, idx) => (
                      <div key={idx} className="field-row-extended">
                        <input type="text" placeholder="username" value={field.name} onChange={(e) => updateField(table.id, idx, "name", e.target.value)} />
                        <input type="text" placeholder="String(100)" value={field.type.split(",")[0].trim()} onChange={(e) => updateField(table.id, idx, "type", e.target.value)} />
                        <label className="field-checkbox">
                          <input type="checkbox" checked={!field.nullable} onChange={(e) => updateField(table.id, idx, "nullable", !e.target.checked)} />
                          <span>Required</span>
                        </label>
                        <label className="field-checkbox">
                          <input type="checkbox" checked={field.unique} onChange={(e) => updateField(table.id, idx, "unique", e.target.checked)} />
                          <span>Unique</span>
                        </label>
                        <button onClick={() => deleteField(table.id, idx)}>X</button>
                      </div>
                    ))}
                    <button className="add-field-btn" onClick={() => addField(table.id)}>
                      + Add Field
                    </button>
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
            <ArrowLeft size={16} /> BACK
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
