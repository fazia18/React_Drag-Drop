import React, { useState, useEffect } from 'react';

const ResizableComponent = ({ width, height, onResize, children }) => {
    const [isResizing, setIsResizing] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [startY, setStartY] = React.useState(0);

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsResizing(true);
        setStartX(e.clientX);
        setStartY(e.clientY);
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    const handleMouseMove = (e) => {
        if (!isResizing) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        onResize({ width: width + dx, height: height + dy });

        setStartX(e.clientX);
        setStartY(e.clientY);
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div
            style={{
                width: `${width}px`,
                height: `${height}px`,
                border: '1px solid #ccc',
                overflow: 'hidden',
                margin: '10px'
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    cursor: 'se-resize',
                }}
                onMouseDown={handleMouseDown}
            >
                {children}
            </div>
        </div>
    );
};

const Layout = () => {
    const [components, setComponents] = React.useState([
        { id: 1, width: 200, height: 200, title: "Component 1", content: "Content of Component 1", },
        { id: 2, width: 200, height: 200, title: "Component 2", content: "Content of Component 2", },
        { id: 3, width: 200, height: 200, title: "Component 3", content: "Content of Component 3", },
    ]);

    const handleResize = (index, size) => {
        setComponents(prevComponents => {
            const newComponents = [...prevComponents];
            newComponents[index] = { ...newComponents[index], width: size.width, height: size.height };
            return newComponents;
        });
    };

    const [formData, setFormData] = useState({ id: null, title: "", content: "" });
    const [count, setCount] = useState({ addCount: 3, updateCount: 0 });

    const handleUpdate = () => {
        const index = components.findIndex(item => item.id === formData.id);
        if (index !== -1) {
            const updatedcomponents = [...components];
            updatedcomponents[index] = formData;
            setComponents(updatedcomponents);
            setFormData({ id: null, title: "", content: "" });
            setCount({ ...count, updateCount: count.updateCount + 1 });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAdd = () => {
        setFormData({ id: null, title: "", content: "" });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.id) {
            handleUpdate();
        } else {
            if (formData.title.trim() !== "" && formData.content.trim() !== "") {
                const newId = components.length + 1;
                const newComponent = { ...formData, id: newId, width: 200, height: 200 };
                setComponents([newComponent, ...components]);
                setCount({ ...count, addCount: count.addCount + 1 });
            } else {
                alert("Please enter both title and content before adding.");
            }
        }
    };

    const handleEdit = (component) => {
        setFormData(component);
    };
    const rows = [];
    for (let i = 0; i < components.length; i += 5) {
        rows.push(components.slice(i, i + 5));
    }

    return (
        <>
            <div>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <textarea type="text" name="title" value={formData.title} placeholder="Title" onChange={handleChange} required />
                        <textarea name="content" value={formData.content} placeholder="Content" onChange={handleChange} required />
                        <div className="buttons">
                            <button type="submit">{formData.id ? 'Update' : 'Add'}</button>
                            <button type="button" onClick={handleAdd}>Add New</button>
                        </div>
                    </form>
                    <div>
                        <p>Add Count: {count.addCount}</p>
                        <p>Update Count: {count.updateCount}</p>
                    </div>
                    {rows.map((row, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {row.map((component) => (
                                <ResizableComponent
                                    key={component.id}
                                    width={component.width}
                                    height={component.height}
                                    onResize={(size) => handleResize(components.findIndex(c => c.id === component.id), size)}
                                >
                                    <div className="component" onClick={() => handleEdit(component)}>
                                        <h3>{component.title}</h3>
                                        <p>{component.content}</p>
                                    </div>
                                </ResizableComponent>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Layout;