import React, { MouseEvent } from "react";
import HighlightPopup from "./HighlightPopup";
import {
  AreaHighlight,
  MonitoredHighlightContainer,
  TextHighlight,
  Tip,
  ViewportHighlight,
  useHighlightContainerContext,
  usePdfHighlighterContext,
} from "react-pdf-highlighter-extended";
import { CommentedHighlight } from "./types";

interface HighlightContainerProps {
  editHighlight: (
    idToUpdate: string,
    edit: Partial<CommentedHighlight>
  ) => void;
  onContextMenu?: (
    event: MouseEvent<HTMLDivElement>,
    highlight: ViewportHighlight<CommentedHighlight>
  ) => void;
}

const HighlightContainer = ({
  editHighlight,
  onContextMenu,
}: HighlightContainerProps) => {
  const {
    highlight,
    viewportToScaled,
    screenshot,
    isScrolledTo,
    highlightBindings,
  } = useHighlightContainerContext<CommentedHighlight>();

  const { toggleEditInProgress } = usePdfHighlighterContext();

  const component =
    highlight.type === "text" ? (
      <TextHighlight
        isScrolledTo={isScrolledTo}
        highlight={highlight}
        onContextMenu={(event) =>
          onContextMenu && onContextMenu(event, highlight)
        }
        style={{
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          border: "10px solid green",
          borderRadius: "10px",
        }}
      />
    ) : (
      <AreaHighlight
        isScrolledTo={isScrolledTo}
        highlight={highlight}
        onChange={(boundingRect) => {
          const edit = {
            position: {
              boundingRect: viewportToScaled(boundingRect),
              rects: [],
            },
            content: {
              image: screenshot(boundingRect),
            },
          };

          editHighlight(highlight.id, edit);
          toggleEditInProgress(false);
        }}
        bounds={highlightBindings.textLayer}
        onContextMenu={(event) =>
          onContextMenu && onContextMenu(event, highlight)
        }
        onEditStart={() => toggleEditInProgress(true)}
        style={{
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          border: "10px solid red",
          borderRadius: "10px",
        }}
      />
    );

  const highlightTip: Tip = {
    position: highlight.position,
    content: <HighlightPopup highlight={highlight} />,
  };

  return (
    <MonitoredHighlightContainer
      highlightTip={highlightTip}
      key={highlight.id}
      children={component}
    />
  );
};

export default HighlightContainer;
