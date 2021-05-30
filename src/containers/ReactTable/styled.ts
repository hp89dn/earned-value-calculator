import styled from "styled-components";
export const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    height: 30px;
    position: relative;
    width: 100%;

    th,
    td {
      cursor: pointer;
      font-size: 14px;
      margin: 0;
      padding-bottom: 7px;
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 7px;
      text-align: justify;
      transition: all 0.2s;
    }

    tr {
      border-top: 1px solid #a7a8af;
    }

    th {
      background-color: #848e9c;
      color: #fff;
    }

    th:not(:first-child) {
      text-align: center;
    }

    tr td:not(:first-child) {
      text-align: center;
    }
  }

  .pagination {
    display: flex;
    font-size: 1.3rem;
    justify-content: space-between;
    margin-top: 10px;

    .pagination-page_number,
    .pagination-page_select {
      color: #fff;

      select,
      input {
        background-color: #313445;
        border: 1px solid #5d76b5;
        border-radius: 2px;
        color: #fff;
        font-size: 1.3rem;
        font-size: 1rem;
        outline: none;
        padding: 0.3rem 0.5rem 0.3rem 0.5rem;
        padding: 0.5rem;
        -webkit-transition: width 0.4s ease-in-out;
        transition: all 0.2s ease-in-out;
        width: 200px;

        /* When the input field gets focus, change its width to 100% */
        :focus {
          border: 1px solid #9aa9d1;
          width: 200px;
        }
      }
    }

    .pagination-button-box {
      button {
        background-color: #2d2e3d;
        border: none;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
        height: 40px;
        margin-right: 5px;
        outline: none;
        transition: ease-in-out 0.3s;
        width: 40px;

        :disabled {
          background-color: #313445;
          color: #49619e;
          cursor: not-allowed;
        }
      }
    }
  }

  .empty {
    background-color: #313445;
    height: 200px;
    left: 0;
    padding: 50px 0;
    position: absolute;
    top: 35px;
    width: 100%;
  }

  input {
    width: 3rem;
  }
`;
