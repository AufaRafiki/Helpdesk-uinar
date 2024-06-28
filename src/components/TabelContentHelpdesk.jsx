/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";

const TabelContentHelpdesk = ({
  item,
  daftarData,
  handleEditShow,
  handleDeleteShow,
}) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th className="no">No</th>
          <th className="name">{`Name of ${item}`}</th>
          <th className="aksi">Action</th>
        </tr>
      </thead>
      <tbody>
        {daftarData.map((data, index) => (
          <tr key={data.id}>
            <td className="no">{index + 1}</td>
            <td className="name">
              {item == "Facta"
                ? data.nama_fakta
                : item == "Conclusion"
                ? data.nama_kesimpulan
                : data.nama_solusi}
            </td>
            <td className="aksi">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top-edit`}>Edit</Tooltip>}
              >
                <Button
                  variant="warning"
                  onClick={() =>
                    handleEditShow(
                      data.id,
                      item === "Facta"
                        ? data.nama_fakta
                        : item === "Conclusion"
                        ? data.nama_kesimpulan
                        : item === "Solution"
                        ? data.nama_solusi
                        : ""
                    )
                  }
                  className="me-2"
                >
                  <span className="material-symbols-outlined">edit</span>
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top-delete`}>Delete</Tooltip>}
              >
                <Button
                  variant="danger"
                  onClick={() => handleDeleteShow(data.id)}
                >
                  <span className="material-symbols-outlined">delete</span>
                </Button>
              </OverlayTrigger>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TabelContentHelpdesk;
