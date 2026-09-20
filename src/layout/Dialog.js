import React, {Component} from "react";
import LinkDialog from "../component/Dialog/LinkDialog";
import AboutDialog from "../component/Dialog/AboutDialog";
import FormDialog from "../component/Dialog/FormDialog";
import HistoryDialog from "../component/Dialog/HistoryDialog";
import SitDownDialog from "../component/Dialog/SitDownDialog";

class Dialog extends Component {
  render() {
    return (
      <div>
        <LinkDialog />
        <AboutDialog />
        <FormDialog />
        <HistoryDialog />
        <SitDownDialog />
      </div>
    );
  }
}

export default Dialog;
