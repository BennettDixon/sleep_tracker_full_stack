const DateSelectorHeader = ({ setViewMode }) => {
  return (
    <ButtonGroup className="date-span-group">
      <Button
        className="date-span-button"
        onClick={this.setViewMode.bind(this, VIEW_MODES.DAY)}
      >
        D
      </Button>

      <Button
        className="date-span-button"
        onClick={this.setViewMode.bind(this, VIEW_MODES.WEEK)}
      >
        W
      </Button>

      <Button
        className="date-span-button"
        onClick={this.setViewMode.bind(this, VIEW_MODES.MONTH)}
      >
        M
      </Button>
    </ButtonGroup>
  );
};
