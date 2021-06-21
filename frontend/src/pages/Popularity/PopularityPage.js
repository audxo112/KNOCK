import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./test.scss"
import classNames from "classnames/bind"

const cx = classNames.bind(styles)

class PopularityPage extends Component {
    static defaultProps = {
        datas: [
            { name: "기린", id: 0 },
            { name: "강아지", id: 1 },
            { name: "토끼", id: 2 },
            { name: "호랑이", id: 3 },
            { name: "사자", id: 4 },
        ]
    }
    viewport = React.createRef()
    target = React.createRef()

    render() {
        const { datas } = this.props
        return (
            <div className="wrapper">
                <section className="card-grid" id="target-root" ref={this.viewport}>
                    {datas.map((animal, index) => {
                        const lastEl = index === datas.length - 1;
                        return (
                            <div
                                key={index}
                                className={`card ${lastEl && "last"}`}
                                ref={lastEl ? this.target : null}
                            >
                                <p>아이디: {animal.id}</p>
                                <p>이름:{animal.name}</p>
                            </div>
                        );
                    })}
                </section>
            </div>
        )
    }
}

export default connect(
    () => {
        return {

        }
    }
)(PopularityPage);