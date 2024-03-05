import React, { useEffect, useState } from 'react';
import { ChildrenEntity } from '../../models/IStrature';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface TreenodeProps {
  structure: ChildrenEntity;
  getStructureData: (strature: ChildrenEntity) => void;
  depth: any;
  currentClickedStructure: string;
}

const Treenode: React.FC<TreenodeProps> = ({ structure, getStructureData, depth, currentClickedStructure }) => {
  const [visible, setVisible] = useState(false);

  const hasChild = structure.children?.length ? true : false;
  const getICon = () => {
    if (!hasChild) {
      return;
    } else {
      return visible ? (
        <FontAwesomeIcon size="1x" icon={faCaretDown} />
      ) : (
        <FontAwesomeIcon size="1x" icon={faCaretRight} />
      );
    }
  };

  const handleClick = () => {
    // Check if the structure ID stored in local storage matches the structure ID of the button being clicked
    const clickedStructureId = localStorage.getItem("clickedStructure");
    if (clickedStructureId === structure._id) {
        // If they match, no need to call getStructureData again
        setVisible(!visible);
        return;
    }
    
    // Call getStructureData only if the structure ID in local storage doesn't match
    
    getStructureData(structure);
    setVisible(!visible);
    
    // Store the clicked structure ID in the local storage
    localStorage.setItem("clickedStructure", structure._id);
    localStorage.setItem("structure_id", structure._id);
    localStorage.setItem("structure", JSON.stringify(structure));
};
  return (
    <div>
      <li key={structure._id} className="">
        <div>
          <div className={`${
            structure._id === currentClickedStructure ? 'bg-gray-200' : ''
          } border-b border-solid border-gray-400 p-1 `}>
            <div className={`flex margin${depth}`}>
              <div onClick={handleClick}>{getICon()}</div>
              <button className={`ml-2 `} onClick={handleClick}>
                <p className={`${structure._id === currentClickedStructure ? 'text-custom-yellow' : ''} text-black  text-sm `}>
                  {structure.name}
                </p>
              </button>
            </div>
          </div>
        </div>
        {hasChild && visible && (
          <div>
            <div>
              <Tree
                tree={structure.children as Array<ChildrenEntity>}
                getStructureData={getStructureData}
                depth={depth + 1}
                currentClickedStructure={currentClickedStructure}
              />
            </div>
          </div>
        )}
      </li>
    </div>
  );
};

interface IProps {
  tree: ChildrenEntity[];
  getStructureData: (strature: ChildrenEntity) => void;
  depth: any;
  currentClickedStructure: string;
}

const Tree: React.FC<IProps> = ({ tree, getStructureData, depth, currentClickedStructure }) => {
  
  return (
    <React.Fragment>
      <ul>
        {tree.map((strature) => {
          return (
            <Treenode
              key={strature._id}
              structure={strature}
              getStructureData={getStructureData}
              depth={depth}
              currentClickedStructure={currentClickedStructure}
            />
          ); 
        })}
      </ul>
    </React.Fragment>
  );
};

export default Tree;
