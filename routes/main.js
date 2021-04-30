const router = require("express").Router();
const db = require("../database/connection");

router.get("/", (req,res) =>{
    db.query("select * from employees",(err,empleado)=>{
        db.query("select * from departments",(err,departamentos) =>{
            db.query("select * from salaries",(err,salario_emp)=>{
                db.query("select * from dept_emp", (err,dept_emp) =>{
                    res.render("Inicio", {empleado,departamentos,salario_emp,dept_emp});
                })
            })
        })
    })
});

router.post("/agregar", (req,res) =>{
    var empleado= req.body;
    console.log(empleado)
    var hoy = new Date();
    contrato=formatoFecha(hoy, 'yy/mm/dd');
    console.log(hoy, contrato);
    db.query("insert into employees set ?",
    [
        {
            emp_no:parseInt(empleado.numero),
            birth_date:empleado.cumple,
            first_name:empleado.nombre,
            last_name:empleado.ap,
            gender:empleado.genero,
            hire_date:contrato
        }
    ], (err,result) =>{
        if(err){
            console.log(err);
        }
    })
    db.query("insert into dept_manager set ?",[{
        emp_no:parseInt(empleado.numero),
        dept_no:empleado.dept,
        from_date:contrato,
        to_date:empleado.final
    }], (err,result) =>{
        if (err) {
            console.log(err)
        }
    })
    db.query("insert into salaries set ?",[{
        emp_no:parseInt(empleado.numero),
        salary:parseInt(empleado.salario),
        from_date:contrato,
        to_date:empleado.final
    }], (err,result) =>{
        if (err) {
            console.log(err)
        }
    })
    db.query("insert into dept_emp set ?",[{
        emp_no:parseInt(empleado.numero),
        dept_no:empleado.dept,
        from_date:contrato,
        to_date:empleado.final
    }], (err,result) =>{
        if (err) {
            console.log(err)
        }
    })
    res.redirect("/");
});

router.get('/eliminar/:emp_no', (req,res) =>{
    const{emp_no}=req.params;
    db.query('delete from employees where emp_no= ?',[emp_no]);
    db.query('delete from salaries where emp_no= ?',[emp_no]);
    db.query('delete from dept_emp where emp_no= ?',[emp_no]);
    db.query('delete from dept_manager where emp_no= ?',[emp_no]);
    res.redirect('/');
});

router.get('/modificar/:emp_no', (req,res) =>{
    const{emp_no}=req.params;
    db.query('select * from employees where emp_no= ?',[emp_no],(err,empleado) =>{
        console.log(empleado);
        res.render('Modificar',{empleado});
    });
});

router.post('/modificacion',(req,res) =>{
    var {numero,cumple,nombre,ap,genero}=req.body;
    var modificar={
        birth_date:cumple,
        first_name:nombre,
        last_name:ap,
        gender:genero
    }
    db.query("update employees set ? where emp_no=?",[modificar,numero]);
    res.redirect('/');
})

router.get('/estudio/:emp_no', (req,res) =>{
    var{emp_no}=req.params;
    db.query('select * from employees where emp_no =?',[emp_no],(err,empleado) =>{
        db.query('select * from titles where emp_no= ?',[emp_no],(err,estudios)=>{
            res.render('Formacion',{empleado,estudios});
        })
    })
});

router.post('/forma', (req,res) =>{
    var estudio = req.body;
    console.log(estudio)
    db.query('insert into titles set ?', [{
        emp_no:parseInt(estudio.numero),
        title:estudio.titu,
        from_date:estudio.init,
        to_date:estudio.end
    }], (err,resul) =>{
        res.redirect('/estudio/'+parseInt(estudio.numero));
    })
})

router.get('/eliminar/estudio/:emp_no/:title', (req,res) =>{
    var{emp_no,title}=req.params;
    db.query('delete from titles where emp_no= ? and title= ?',[emp_no, title]);
    res.redirect('/estudio/'+emp_no);
});

function formatoFecha(fecha, formato) {
    fecha=formato.replace('mm', fecha.getMonth() + 1)
    .replace('yy', fecha.getFullYear())
	.replace('dd', fecha.getDate());

    console.log(fecha)
    return fecha;
}

module.exports = router;